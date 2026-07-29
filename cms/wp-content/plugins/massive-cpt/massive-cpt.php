<?php
/*
Plugin Name: Massive Designs CPT
Description: Headless CMS for Projects
Version: 1.2
*/

if (!defined('ABSPATH')) exit;

// ── Cache path helper — dono files ke liye same ───────────────
function md_cache_root() {
    // Plugin: public_html/cms/wp-content/plugins/massive-cpt/
    // 4 levels upar = public_html/
    return dirname(dirname(dirname(dirname(__DIR__))));
}

// ── Image compression band karo ───────────────────────────────
add_filter('jpeg_quality', function() { return 100; });
add_filter('wp_editor_set_quality', function() { return 100; });

// ── CPT Register ──────────────────────────────────────────────
add_action('init', function () {

    register_post_type('projects', [
        'labels'       => ['name' => 'Projects', 'singular_name' => 'Project'],
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'thumbnail', 'page-attributes'],
        'menu_icon'    => 'dashicons-portfolio',
    ]);

    register_taxonomy('project_category', 'projects', [
        'labels'       => ['name' => 'Project Categories'],
        'public'       => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite'      => ['slug' => 'project-category'],
    ]);
});

// ── REST Fields ───────────────────────────────────────────────
add_action('rest_api_init', function () {

    register_rest_field('projects', 'featured_image_url', [
        'get_callback' => function ($post) {
            $id = get_post_thumbnail_id($post['id']);
            if (!$id) return null;
            $img = wp_get_attachment_image_src($id, 'full');
            return $img ? $img[0] : null;
        },
        'update_callback' => null,
        'schema'          => null,
    ]);

    register_rest_field('projects', 'project_categories', [
        'get_callback' => function ($post) {
            $terms = wp_get_post_terms($post['id'], 'project_category', ['fields' => 'slugs']);
            return is_wp_error($terms) ? [] : $terms;
        },
        'update_callback' => null,
        'schema'          => null,
    ]);

    register_rest_field('projects', 'acf', [
        'get_callback' => function ($post) {
            return [
                'project_link' => function_exists('get_field') ? (get_field('project_link', $post['id']) ?: '') : '',
                'video_url'    => function_exists('get_field') ? (get_field('video_url', $post['id']) ?: '') : '',
            ];
        },
        'update_callback' => null,
        'schema'          => null,
    ]);
});

// ── per_page limit ────────────────────────────────────────────
add_filter('rest_projects_collection_params', function ($params) {
    $params['per_page']['maximum'] = 500;
    return $params;
});

// ── Cache auto-clear on save ──────────────────────────────────
add_action('save_post_projects', function () {
    $root = md_cache_root();
    @unlink($root . '/md_projects_cache.json');
    @unlink($root . '/md_categories_cache.json');
});

// ── Taxonomy save pe bhi cache clear ─────────────────────────
add_action('created_project_category', function () {
    $root = md_cache_root();
    @unlink($root . '/md_categories_cache.json');
});
add_action('edited_project_category', function () {
    $root = md_cache_root();
    @unlink($root . '/md_categories_cache.json');
});
add_action('delete_project_category', function () {
    $root = md_cache_root();
    @unlink($root . '/md_categories_cache.json');
});

// ── Admin Menu ────────────────────────────────────────────────
add_action('admin_menu', function () {
    add_submenu_page(
        'edit.php?post_type=projects',
        'Bulk Import Projects',
        'Bulk Import',
        'manage_options',
        'md-bulk-import',
        'md_bulk_import_page_callback'
    );
});

add_action('admin_enqueue_scripts', function($hook) {
    if (strpos($hook, 'md-bulk-import') !== false) {
        wp_enqueue_media();
    }
});

// ── Bulk Import Callback ──────────────────────────────────────
function md_bulk_import_page_callback() {
    ?>
    <div class="wrap">
        <h1>Bulk Import Projects</h1>
        <?php
        if (isset($_POST['submit_bulk']) && check_admin_referer('md_bulk_import_nonce')) {
            $files         = $_FILES['bulk_images'] ?? null;
            $media_ids     = array_filter(explode(',', sanitize_text_field($_POST['media_ids'] ?? '')));
            $category_slug = sanitize_text_field($_POST['project_category'] ?? '');
            $base_link     = sanitize_text_field($_POST['base_link'] ?? '');

            if ((!empty($files['name'][0]) || !empty($media_ids)) && !empty($category_slug)) {
                $count  = 0;
                $errors = [];

                require_once ABSPATH . 'wp-admin/includes/image.php';
                require_once ABSPATH . 'wp-admin/includes/file.php';
                require_once ABSPATH . 'wp-admin/includes/media.php';

                $link = ($category_slug === 'website' && !empty($base_link)) ? $base_link : '/contact';

                // ── 1. File upload ────────────────────────────────
                if (!empty($files['name'][0])) {
                    foreach ($files['name'] as $i => $name) {
                        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                            $errors[] = "Upload error: $name";
                            continue;
                        }
                        $file_array = [
                            'name'     => $files['name'][$i],
                            'type'     => $files['type'][$i],
                            'tmp_name' => $files['tmp_name'][$i],
                            'error'    => $files['error'][$i],
                            'size'     => $files['size'][$i],
                        ];
                        $title   = pathinfo($name, PATHINFO_FILENAME);
                        $post_id = wp_insert_post([
                            'post_title'  => sanitize_text_field($title),
                            'post_type'   => 'projects',
                            'post_status' => 'publish',
                            'menu_order'  => 0,
                        ]);
                        if (is_wp_error($post_id)) { $errors[] = "Post create failed: $name"; continue; }

                        $attach_id = media_handle_sideload($file_array, $post_id);
                        if (is_wp_error($attach_id)) {
                            wp_delete_post($post_id, true);
                            $errors[] = "Attach failed: $name";
                            continue;
                        }
                        set_post_thumbnail($post_id, $attach_id);
                        wp_set_object_terms($post_id, $category_slug, 'project_category');
                        if (function_exists('update_field')) update_field('project_link', $link, $post_id);
                        $count++;
                    }
                }

                // ── 2. Media Library ──────────────────────────────
                foreach ($media_ids as $attach_id) {
                    $attach_id = (int) $attach_id;
                    if (!$attach_id) continue;

                    $title   = get_the_title($attach_id) ?: "Project $attach_id";
                    $post_id = wp_insert_post([
                        'post_title'  => sanitize_text_field($title),
                        'post_type'   => 'projects',
                        'post_status' => 'publish',
                        'menu_order'  => 0,
                    ]);
                    if (is_wp_error($post_id)) { $errors[] = "Post create failed for media ID: $attach_id"; continue; }

                    set_post_thumbnail($post_id, $attach_id);
                    wp_set_object_terms($post_id, $category_slug, 'project_category');
                    if (function_exists('update_field')) update_field('project_link', $link, $post_id);
                    $count++;
                }

                // ── Cache clear after import ──────────────────────
                $root = md_cache_root();
                @unlink($root . '/md_projects_cache.json');
                @unlink($root . '/md_categories_cache.json');

                echo '<div class="notice notice-success"><p>Successfully created ' . $count . ' projects.</p>';
                if (!empty($errors)) echo '<br><strong>Errors:</strong><br>' . implode('<br>', array_map('esc_html', $errors));
                echo '</p></div>';

            } else {
                echo '<div class="notice notice-error"><p>Please select images and a category.</p></div>';
            }
        }
        ?>

        <form method="post" enctype="multipart/form-data">
            <?php wp_nonce_field('md_bulk_import_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th><label>Upload New Images</label></th>
                    <td><input type="file" name="bulk_images[]" multiple accept="image/*"></td>
                </tr>
                <tr>
                    <th><label>Media Library se Select</label></th>
                    <td>
                        <input type="hidden" name="media_ids" id="media_ids" value="">
                        <button type="button" class="button" id="open_media_btn">Media Library</button>
                        <div id="media_preview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;"></div>
                    </td>
                </tr>
                <tr>
                    <th><label for="project_category">Category</label></th>
                    <td>
                        <select name="project_category" id="project_category" required>
                            <option value="">-- Select --</option>
                            <?php
                            $categories = get_terms(['taxonomy' => 'project_category', 'hide_empty' => false]);
                            foreach ($categories as $cat) {
                                echo '<option value="' . esc_attr($cat->slug) . '">' . esc_html($cat->name) . '</option>';
                            }
                            ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th><label for="base_link">Base Link (Website ke liye)</label></th>
                    <td>
                        <input type="url" name="base_link" id="base_link" class="regular-text" placeholder="https://example.com/">
                        <p class="description">Website category ke liye link — baaki sab ke liye /contact lagega.</p>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="submit_bulk" class="button button-primary" value="Import Projects">
            </p>
        </form>
    </div>

    <script>
    jQuery(document).ready(function($) {
        var mediaFrame;
        var selectedIds = [];

        $('#open_media_btn').on('click', function(e) {
            e.preventDefault();
            if (mediaFrame) { mediaFrame.open(); return; }

            mediaFrame = wp.media({
                title: 'Images Select Karo',
                button: { text: 'Select' },
                multiple: true,
                library: { type: 'image' }
            });

            mediaFrame.on('select', function() {
                var attachments = mediaFrame.state().get('selection').toJSON();
                attachments.forEach(function(att) {
                    if (selectedIds.indexOf(att.id) === -1) {
                        selectedIds.push(att.id);
                        var thumb = att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url;
                        $('#media_preview').append(
                            '<div style="position:relative;">' +
                            '<img src="' + thumb + '" style="width:80px;height:80px;object-fit:cover;border:2px solid #ccc;border-radius:4px;">' +
                            '<span data-id="' + att.id + '" style="position:absolute;top:-6px;right:-6px;background:red;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;cursor:pointer;font-size:12px;line-height:18px;">x</span>' +
                            '</div>'
                        );
                    }
                });
                $('#media_ids').val(selectedIds.join(','));
            });

            mediaFrame.open();
        });

        $('#media_preview').on('click', 'span', function() {
            var id = parseInt($(this).data('id'));
            selectedIds = selectedIds.filter(function(i) { return i !== id; });
            $('#media_ids').val(selectedIds.join(','));
            $(this).parent().remove();
        });
    });
    </script>
    <?php
}