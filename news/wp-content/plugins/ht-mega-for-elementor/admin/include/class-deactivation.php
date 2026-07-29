<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTmega_Plugin_Deactivation_Feedback {

    public $PROJECT_NAME = 'HT Mega';
    public $PROJECT_TYPE = 'wordpress-plugin';
    public $PROJECT_VERSION = HTMEGA_VERSION;
    public $PROJECT_SLUG = 'ht-mega-for-elementor'; // Without plugin main file.
    public $PROJECT_PRO_SLUG = 'htmega-pro/htmega_pro.php';
    public $PROJECT_PRO_ACTIVE;
    public $PROJECT_PRO_INSTALL;
    public $PROJECT_PRO_VERSION;
    public $DATA_CENTER = 'https://exit-feedback.hasthemes.com/w/f6d46a1c-3d29-4079-baa0-8de1cb0dcc01';
    public $WEBHOOK_SECRET = '83d687b0cf4e635ac08e9c7ff1468f5fe98228c631d30c438bc49eae1ef69d03';

    private static $_instance = null;

    public static function instance(){
        if( is_null( self::$_instance ) ){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct() {
        $this->PROJECT_PRO_ACTIVE = $this->is_pro_plugin_active();
        $this->PROJECT_PRO_INSTALL = $this->is_pro_plugin_installed();
        $this->PROJECT_PRO_VERSION = $this->get_pro_version();
        add_action('admin_footer', [ $this, 'deactivation_feedback' ]);
        add_action('wp_ajax_htmega_plugin_deactivation_feedback', [ $this, 'handle_feedback' ]);
    }

    /**
     * Handle AJAX feedback submission
     */
    public function handle_feedback() {
        if ( !check_ajax_referer('htmega_deactivation_nonce', 'nonce', false) ) {
            wp_send_json_error('Invalid nonce');
            return;
        }

        if(!current_user_can( 'administrator' )) {
            wp_send_json_error('Permission denied');
            return;
        }

        $reason = sanitize_text_field($_POST['reason']);
        $message = sanitize_textarea_field($_POST['message']);

        $data = array_merge(
            [
                'deactivate_reason' => $reason,
                'deactivate_message' => $message,
            ],
            $this->get_data(),
        );

        $body = wp_json_encode( $data );

        $site_url = wp_parse_url( home_url(), PHP_URL_HOST );
        $headers = [
            'user-agent'   => $this->PROJECT_NAME . '/' . md5( $site_url ) . ';',
            'Content-Type' => 'application/json',
        ];

        $signature = $this->generate_signature( $body );
        if ( ! empty( $signature ) ) {
            $headers['X-Webhook-Signature'] = $signature;
        }

        $response = wp_remote_post($this->DATA_CENTER, [
            'method'      => 'POST',
            'timeout'     => 30,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking'    => false,
            'sslverify'   => false,
            'headers'     => $headers,
            'body'        => $body,
            'cookies'     => []
        ]);

        if (!is_wp_error($response)) {
            wp_send_json_success('Feedback submitted successfully');
        } else {
            wp_send_json_error('Failed to submit feedback: ' . $response->get_error_message());
        }
    }

    public function get_data() {

        // Get plugin specific information
        $project = [
            'name'          => $this->PROJECT_NAME,
            'type'          => $this->PROJECT_TYPE,
            'version'       => $this->PROJECT_VERSION,
            'pro_active'    => $this->PROJECT_PRO_ACTIVE,
            'pro_installed' => $this->PROJECT_PRO_INSTALL,
            'pro_version'   => $this->PROJECT_PRO_VERSION,
        ];

        $site_title = get_bloginfo( 'name' );
        $site_url = wp_parse_url( home_url(), PHP_URL_HOST );
        $admin_email = get_option( 'admin_email' );

        $admin_first_name = '';
        $admin_last_name = '';
        $admin_display_name = '';

        $users = get_users( array(
            'role'    => 'administrator',
            'orderby' => 'ID',
            'order'   => 'ASC',
            'number'  => 1,
            'paged'   => 1,
        ) );

        $admin_user = ( is_array ( $users ) && isset ( $users[0] ) && is_object ( $users[0] ) ) ? $users[0] : null;

        if ( ! empty( $admin_user ) ) {
            $admin_first_name = ( isset( $admin_user->first_name ) ? $admin_user->first_name : '' );
            $admin_last_name = ( isset( $admin_user->last_name ) ? $admin_user->last_name : '' );
            $admin_display_name = ( isset( $admin_user->display_name ) ? $admin_user->display_name : '' );
        }

        $ip_address = $this->get_ip_address();
        $install_time = get_option( 'htmega_elementor_addons_activation_time' );
        $data = [
            'project'            => $project,
            'site_title'         => $site_title,
            'site_address'       => $site_url,
            'site_url'           => $site_url,
            'admin_email'        => $admin_email,
            'admin_first_name'   => $admin_first_name,
            'admin_last_name'    => $admin_last_name,
            'admin_display_name' => $admin_display_name,
            'server_info'        => $this->get_server_info(),
            'wordpress_info'     => $this->get_wordpress_info(),
            'plugins_count'      => $this->get_plugins_count(),
            'ip_address'         => $ip_address,
            'country_name'       => $this->get_country_from_ip( $ip_address ),
            'plugin_list'        => $this->get_active_plugins(),
            'install_time'       => $install_time,
        ];

        return $data;
    }

    /**
     * Get server info.
     */
    private function get_server_info() {
        global $wpdb;

        $software = ( isset ( $_SERVER['SERVER_SOFTWARE'] ) && !empty ( $_SERVER['SERVER_SOFTWARE'] ) ) ? $_SERVER['SERVER_SOFTWARE'] : '';
        $php_version = function_exists ( 'phpversion' ) ? phpversion () : '';
        $mysql_version = method_exists ( $wpdb, 'db_version' ) ? $wpdb->db_version () : '';

        $server_info = array(
            'software'             => $software,
            'php_version'          => $php_version,
            'mysql_version'        => $mysql_version,
        );

        return $server_info;
    }

    /**
     * Get wordpress info.
     */
    private function get_wordpress_info() {
        $wordpress_info = [];

        $debug_mode = ( defined ( 'WP_DEBUG' ) && WP_DEBUG ) ? 'yes' : 'no';
        $locale = get_locale();
        $version = get_bloginfo( 'version' );
        $theme_slug = get_stylesheet();

        $wordpress_info = [
            'debug_mode'   => $debug_mode,
            'locale'       => $locale,
            'version'      => $version,
            'theme_slug'   => $theme_slug,
        ];

        $theme = wp_get_theme( $wordpress_info['theme_slug'] );

        if ( is_object( $theme ) && ! empty( $theme ) && method_exists( $theme, 'get' ) ) {
            $theme_name    = $theme->get( 'Name' );
            $theme_version = $theme->get( 'Version' );
            $theme_uri     = $theme->get( 'ThemeURI' );
            $theme_author  = $theme->get( 'Author' );

            $wordpress_info = array_merge( $wordpress_info, [
                'theme_name'    => $theme_name,
                'theme_version' => $theme_version,
                'theme_uri'     => $theme_uri,
                'theme_author'  => $theme_author,
            ] );
        }

        return $wordpress_info;
    }

    /**
     * Get plugins count.
     */
    private function get_plugins_count() {
        $total_plugins_count = 0;
        $active_plugins_count = 0;
        $inactive_plugins_count = 0;

        $plugins = get_plugins();
        $plugins = is_array ( $plugins ) ? $plugins : [];

        $active_plugins = get_option( 'active_plugins', [] );
        $active_plugins = is_array ( $active_plugins ) ? $active_plugins : [];

        if ( ! empty( $plugins ) ) {
            foreach ( $plugins as $key => $data ) {
                if ( in_array( $key, $active_plugins, true ) ) {
                    $active_plugins_count++;
                } else {
                    $inactive_plugins_count++;
                }

                $total_plugins_count++;
            }
        }

        $plugins_count = [
            'total'    => $total_plugins_count,
            'active'   => $active_plugins_count,
            'inactive' => $inactive_plugins_count,
        ];

        return $plugins_count;
    }

    /**
     * Get active plugins.
     */
    private function get_active_plugins() {
        $active_plugins = get_option('active_plugins');
        $all_plugins = get_plugins();
        $active_plugin_string = '';
        foreach($all_plugins as $plugin_path => $plugin) {
            if ( ! in_array($plugin_path, $active_plugins) ) {
                continue;
            }
            $active_plugin_string .= sprintf(
                "%s (v%s) - %s | ",
                $plugin['Name'],
                $plugin['Version'],
                'Active'
            );
        }
        $active_plugin_string = rtrim($active_plugin_string, ' | ');
        return $active_plugin_string;
    }

    /**
     * Get IP Address
     */
    private function get_ip_address() {
        $response = wp_remote_get( 'https://icanhazip.com/' );

        if ( is_wp_error( $response ) ) {
            return '';
        }

        $ip_address = wp_remote_retrieve_body( $response );
        $ip_address = trim( $ip_address );

        if ( ! filter_var( $ip_address, FILTER_VALIDATE_IP ) ) {
            return '';
        }

        return $ip_address;
    }

    /**
     * Get Country From IP Address
     */
    private function get_country_from_ip( $ip_address ) {
        $api_url = 'http://ip-api.com/json/' . $ip_address;

        $response = wp_remote_get( $api_url );

        if ( is_wp_error( $response ) ) {
            return 'Error';
        }

        $data = json_decode( wp_remote_retrieve_body($response) );

        if ($data && $data->status === 'success') {
            return $data->country;
        } else {
            return 'Unknown';
        }
    }

    /**
     * Generate HMAC-SHA256 signature for webhook payload.
     */
    private function generate_signature( $payload ) {
        if ( empty( $this->WEBHOOK_SECRET ) ) {
            return '';
        }
        return 'sha256=' . hash_hmac( 'sha256', $payload, $this->WEBHOOK_SECRET );
    }

    /**
     * Is pro active.
     */
    private function is_pro_plugin_active() {
        $result = is_plugin_active( $this->PROJECT_PRO_SLUG );
        $result = ( true === $result ) ? 'yes' : 'no';
        return $result;
    }

    /**
     * Is pro installed.
     */
    private function is_pro_plugin_installed() {
        $plugins = get_plugins();
        $result = isset ( $plugins[$this->PROJECT_PRO_SLUG] ) ? 'yes' : 'no';
        return $result;
    }

    /**
     * Get pro version.
     */
    private function get_pro_version() {
        $plugins = get_plugins();
        $data = ( isset ( $plugins[$this->PROJECT_PRO_SLUG] ) && is_array ( $plugins[$this->PROJECT_PRO_SLUG] ) ) ? $plugins[$this->PROJECT_PRO_SLUG] : [];
        $version = isset ( $data['Version'] ) ? sanitize_text_field ( $data['Version'] ) : '';
        return $version;
    }

    public function deactivation_feedback() {
        // Only show on plugins page
        $screen = get_current_screen();
        if ($screen->id !== 'plugins') {
            return;
        }

        $this->deactivation_form_html();
    }

    /**
     * Deactivation form html.
     */
    public function deactivation_form_html() {
        $ajaxurl = admin_url('admin-ajax.php');
        $nonce = wp_create_nonce('htmega_deactivation_nonce');
    ?>

<div id="htmega-deactivation-dialog" class="htm-deactivate-overlay" style="display: none;">
    <div class="htm-deactivate-modal">
        <!-- Header -->
        <div class="htm-deactivate-header">
            <button type="button" class="htm-close-btn htmega-close-dialog" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="htm-header-content">
                <div class="htm-header-icon">
                    <img src="<?php echo esc_url( HTMEGA_ADDONS_PL_URL . 'admin/assets/images/logo.png' ); ?>" alt="<?php esc_attr_e('HT Mega Logo', 'htmega-addons'); ?>">
                </div>
                <div class="htm-header-text">
                    <h3><?php esc_html_e("We're Sorry to See You Go!", 'htmega-addons') ?></h3>
                    <p><?php esc_html_e('Your feedback helps us improve HT Mega for everyone.', 'htmega-addons') ?></p>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="htm-deactivate-body">
            <p class="htm-body-title"><?php esc_html_e('Please share why you\'re deactivating HT Mega:', 'htmega-addons') ?></p>

            <form id="htmega-deactivation-feedback-form">
                <div class="htm-reasons-list">
                    <!-- Reason 1: Temporary -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_temporary" data-id="" value="<?php esc_attr_e("It's a temporary deactivation", 'htmega-addons') ?>">
                        <label for="htm_reason_temporary" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e("It's a temporary deactivation", 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>

                    <!-- Reason 2: No longer need -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_no_need" data-id="" value="<?php esc_attr_e('I no longer need the plugin', 'htmega-addons') ?>">
                        <label for="htm_reason_no_need" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e('I no longer need the plugin', 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>

                    <!-- Reason 3: Found better -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_better" data-id="found_better" value="<?php esc_attr_e('I found a better plugin', 'htmega-addons') ?>">
                        <label for="htm_reason_better" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e('I found a better plugin', 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>
                    <div id="htmega-found_better-reason-text" class="htm-additional-input htmega-deactivation-reason-input">
                        <textarea name="found_better_reason" placeholder="<?php esc_attr_e('Which plugin are you switching to? We\'d love to know...', 'htmega-addons') ?>"></textarea>
                    </div>

                    <!-- Reason 4: Not working -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_not_working" data-id="stopped_working" value="<?php esc_attr_e('The plugin suddenly stopped working', 'htmega-addons') ?>">
                        <label for="htm_reason_not_working" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e('The plugin suddenly stopped working', 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>
                    <div id="htmega-stopped_working-reason-text" class="htm-additional-input htmega-deactivation-reason-input">
                        <textarea name="stopped_working_reason" placeholder="<?php esc_attr_e('Please describe the issue you\'re experiencing...', 'htmega-addons') ?>"></textarea>
                    </div>

                    <!-- Reason 5: Bug -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_bug" data-id="found_bug" value="<?php esc_attr_e('I encountered an error or bug', 'htmega-addons') ?>">
                        <label for="htm_reason_bug" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e('I encountered an error or bug', 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>
                    <div id="htmega-found_bug-reason-text" class="htm-additional-input htmega-deactivation-reason-input">
                        <textarea name="found_bug_reason" placeholder="<?php esc_attr_e('Please describe the error/bug. This will help us fix it...', 'htmega-addons') ?>"></textarea>
                    </div>

                    <!-- Reason 6: Other -->
                    <div class="htm-reason-item">
                        <input type="radio" name="reason" id="htm_reason_other" data-id="other" value="<?php esc_attr_e('Other', 'htmega-addons') ?>">
                        <label for="htm_reason_other" class="htm-reason-label">
                            <span class="htm-reason-radio"></span>
                            <span class="htm-reason-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                </svg>
                            </span>
                            <span class="htm-reason-text">
                                <span><?php esc_html_e('Other', 'htmega-addons') ?></span>
                            </span>
                        </label>
                    </div>
                    <div id="htmega-other-reason-text" class="htm-additional-input htmega-deactivation-reason-input">
                        <textarea name="other_reason" placeholder="<?php esc_attr_e('Please share the reason...', 'htmega-addons') ?>"></textarea>
                    </div>
                </div>

                <!-- Footer -->
                <div class="htm-deactivate-footer">
                    <a href="#" class="htm-btn htm-btn-skip htmega-skip-feedback"><?php esc_html_e('Skip & Deactivate', 'htmega-addons') ?></a>
                    <button type="submit" class="htm-btn htm-btn-submit">
                        <span><?php esc_html_e('Submit & Deactivate', 'htmega-addons') ?></span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    ;jQuery(document).ready(function($) {
        let pluginToDeactivate = '';

        function closeDialog() {
            $('#htmega-deactivation-dialog').animate({
                opacity: 0
            }, 'slow', function() {
                $(this).css('display', 'none');
            });
            pluginToDeactivate = '';
        }

        // Open dialog when deactivate is clicked
        $('[data-slug="<?php echo esc_attr($this->PROJECT_SLUG); ?>"] .deactivate a').on('click', function(e) {
            e.preventDefault();
            pluginToDeactivate = $(this).attr('href');
            $('#htmega-deactivation-dialog').css({'display': 'flex', 'opacity': '1'});
        });

        // Close dialog on X button click
        $('.htmega-close-dialog').on('click', closeDialog);

        // Close dialog on overlay click
        $('#htmega-deactivation-dialog').on('click', function(e) {
            if (e.target === this) {
                closeDialog();
            }
        });

        // Prevent close when clicking modal content
        $('.htm-deactivate-modal').on('click', function(e) {
            e.stopPropagation();
        });

        // Handle radio button change - show/hide textarea
        $('input[name="reason"]').on('change', function() {
            $('.htmega-deactivation-reason-input').removeClass('active').hide();

            const id = $(this).data('id');
            if (['other', 'found_better', 'stopped_working', 'found_bug'].includes(id)) {
                $(`#htmega-${id}-reason-text`).addClass('active').show();
                $(`#htmega-${id}-reason-text textarea`).focus();
            }
        });

        // Handle form submission
        $('#htmega-deactivation-feedback-form').on('submit', function(e) {
            e.preventDefault();

            const $submitButton = $(this).find('button[type="submit"]');
            const $buttonText = $submitButton.find('span');
            const originalText = $buttonText.text();

            $buttonText.text('<?php esc_html_e('Submitting...', 'htmega-addons') ?>');
            $submitButton.prop('disabled', true);

            const reason = $('input[name="reason"]:checked').val() || 'No reason selected';
            const message = $('.htmega-deactivation-reason-input.active textarea').val() || '';

            const data = {
                action: 'htmega_plugin_deactivation_feedback',
                reason: reason,
                message: message,
                nonce: '<?php echo esc_js($nonce); ?>'
            };

            $.post('<?php echo esc_url_raw($ajaxurl); ?>', data)
                .done(function(response) {
                    if (response.success) {
                        window.location.href = pluginToDeactivate;
                    } else {
                        console.error('Feedback submission failed:', response.data);
                        $buttonText.text(originalText);
                        $submitButton.prop('disabled', false);
                    }
                })
                .fail(function(xhr) {
                    console.error('Feedback submission failed:', xhr.responseText);
                    $buttonText.text(originalText);
                    $submitButton.prop('disabled', false);
                });
        });

        // Skip feedback and deactivate
        $('.htmega-skip-feedback').on('click', function(e) {
            e.preventDefault();
            window.location.href = pluginToDeactivate;
        });
    });
</script>

<style>
    /* Overlay */
    #htmega-deactivation-dialog.htm-deactivate-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        animation: htmFadeIn 0.3s ease;
    }

    @keyframes htmFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes htmFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes htmSlideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes htmSlideDown {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
    }

    /* Closing animation classes */
    #htmega-deactivation-dialog.htm-deactivate-overlay.htm-closing {
        animation: htmFadeOut 0.25s ease forwards;
    }

    #htmega-deactivation-dialog.htm-closing .htm-deactivate-modal {
        animation: htmSlideDown 0.25s ease forwards;
    }

    /* Modal Container */
    .htm-deactivate-modal {
        background: #ffffff;
        border-radius: 8px;
        width: 480px;
        max-width: 95%;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: htmSlideUp 0.4s ease;
    }

    /* Header */
    .htm-deactivate-header {
        background: linear-gradient(135deg, #C02D5E 0%, #D43A6B 50%, #DA4D7A 100%);
        padding: 20px 28px;
        position: relative;
        overflow: hidden;
    }

    .htm-deactivate-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 200px;
        height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
    }

    .htm-deactivate-header::after {
        content: '';
        position: absolute;
        bottom: -30%;
        left: 10%;
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
    }

    .htm-header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .htm-header-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .htm-header-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .htm-header-text h3 {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 2px 0;
    }

    .htm-header-text p {
        color: rgba(255, 255, 255, 0.85);
        font-size: 12px;
        font-weight: 400;
        margin: 0;
    }

    /* Close Button */
    .htm-close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 2;
        padding: 0;
    }

    .htm-close-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: rotate(90deg);
    }

    .htm-close-btn svg {
        width: 16px;
        height: 16px;
        stroke: #ffffff;
        stroke-width: 2;
    }

    /* Body Content */
    .htm-body-title {
        font-size: 14px;
        color: #374151;
        font-weight: 500;
        margin: 20px 0 0 0;
        padding: 0 25px;
    }

    /* Reason Options */
    .htm-reasons-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 20px 25px;
    }

    .htm-reason-item {
        position: relative;
    }

    .htm-reason-item input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .htm-reason-label {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.25s ease;
    }

    .htm-reason-label:hover {
        border-color: #D43A6B;
        background: #FDF2F5;
    }

    .htm-reason-item input[type="radio"]:checked + .htm-reason-label {
        border-color: #D43A6B;
        background: #FDF2F5;
        box-shadow: 0 2px 8px rgba(212, 58, 107, 0.15);
    }

    .htm-reason-radio {
        width: 14px;
        height: 14px;
        min-width: 14px;
        border: 2px solid #d1d5db;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
    }

    .htm-reason-item input[type="radio"]:checked + .htm-reason-label .htm-reason-radio {
        border-color: #D43A6B;
        background: #D43A6B;
    }

    .htm-reason-radio::after {
        content: '';
        width: 6px;
        height: 6px;
        background: #ffffff;
        border-radius: 50%;
        transform: scale(0);
        transition: transform 0.2s ease;
    }

    .htm-reason-item input[type="radio"]:checked + .htm-reason-label .htm-reason-radio::after {
        transform: scale(1);
    }

    .htm-reason-icon {
        width: 30px;
        height: 30px;
        min-width: 30px;
        background: #FBDFE5;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
    }

    .htm-reason-item input[type="radio"]:checked + .htm-reason-label .htm-reason-icon {
        background: #D43A6B;
    }

    .htm-reason-icon svg {
        width: 15px;
        height: 15px;
        stroke: #D43A6B;
        stroke-width: 2;
        fill: none;
        transition: all 0.25s ease;
    }

    .htm-reason-item input[type="radio"]:checked + .htm-reason-label .htm-reason-icon svg {
        stroke: #ffffff;
    }

    .htm-reason-text {
        flex: 1;
    }

    .htm-reason-text span {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        display: block;
        line-height: 1.3;
    }

    /* Additional Input Field */
    .htm-additional-input.htmega-deactivation-reason-input {
        margin-top: 6px;
        margin-bottom: 6px;
        display: none;
        animation: htmInputSlideDown 0.3s ease;
    }

    .htm-additional-input.htmega-deactivation-reason-input.active {
        display: block;
    }

    @keyframes htmInputSlideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .htm-additional-input textarea {
        width: 100%;
        min-height: 70px;
        padding: 12px 14px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 13px;
        font-family: inherit;
        resize: vertical;
        transition: all 0.25s ease;
        background: #ffffff;
        box-sizing: border-box;
    }

    .htm-additional-input textarea:focus {
        outline: none;
        border-color: #D43A6B;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(212, 58, 107, 0.1);
    }

    .htm-additional-input textarea::placeholder {
        color: #94a3b8;
    }

    /* Footer */
    .htm-deactivate-footer {
        padding: 16px 28px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-top: 1px solid #e5e5e5;
        margin-top: 10px;
    }

    .htm-btn {
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.25s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
    }

    .htm-btn-skip {
        background: transparent;
        color: #6B7280;
        padding: 10px 0;
    }

    .htm-btn-skip:hover {
        color: #D43A6B;
    }

    .htm-btn-submit {
        background: #D43A6B;
        border: 1px solid #D43A6B;
        color: #ffffff;
    }

    .htm-btn-submit:hover {
        background: #C02D5E;
        border-color: #C02D5E;
        color: #ffffff;
    }

    .htm-btn-submit:active {
        background: #A82550;
    }

    .htm-btn-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .htm-btn-submit svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2;
        fill: none;
    }

    /* Responsive */
    @media (max-width: 600px) {
        .htm-deactivate-modal {
            margin: 16px;
        }

        .htm-deactivate-header {
            padding: 16px 20px;
        }

        .htm-deactivate-body {
            padding: 16px 20px;
        }

        .htm-deactivate-footer {
            padding: 14px 20px 18px;
            flex-direction: column;
        }

        .htm-btn {
            width: 100%;
            justify-content: center;
        }
    }
</style>

    <?php }
}

// Initialize the class
HTmega_Plugin_Deactivation_Feedback::instance();
