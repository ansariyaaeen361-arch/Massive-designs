<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

class HTMega_Template_Library{

    const TRANSIENT_KEY = 'htmega_template_info';
    const CACHE_DIR = 'htmega-addons';
    const CACHE_FILE = 'htmega_template_info.json';
    const CACHE_META_FILE = 'htmega_template_meta.json';
    const CACHE_EXPIRY = 2592000; // 30 days in seconds
    public static $buylink = null;

    public static $endpoint     = 'https://library.wphtmega.com/wp-json/htmega/v1/templates';
    public static $templateapi  = 'https://library.wphtmega.com/wp-json/htmega/v1/templates/%s';


    public static $api_args = [];

    private static $_instance = null;
    public static function instance(){
        if( is_null( self::$_instance ) ){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    function __construct(){
        self::$buylink = isset( HTMega_Addons_Elementor::$template_info['pro_link'] ) ? HTMega_Addons_Elementor::$template_info['pro_link'] : '#';
        if ( is_admin() ) {
            add_action( 'admin_menu', [ $this, 'admin_menu' ], 225 );
            add_action( 'wp_ajax_htmega_ajax_request', [ $this, 'templates_ajax_request' ] );
            add_action( 'wp_ajax_nopriv_htmega_ajax_request', [ $this, 'templates_ajax_request' ] );
            add_action( 'wp_ajax_htmega_get_templates', [ $this, 'get_templates_ajax' ] );

            add_action( 'wp_ajax_htmega_ajax_get_required_plugin', [ $this, 'ajax_plugin_data' ] );
            add_action( 'wp_ajax_htmega_ajax_plugin_activation', [ $this, 'ajax_plugin_activation' ] );
            add_action( 'wp_ajax_htmega_ajax_theme_activation', [ $this, 'ajax_theme_activation' ] );
        }
        self::$api_args = [
            'plugin_version' => HTMEGA_VERSION,
            'url'            => home_url(),
        ];

    }

    /**
     * AJAX endpoint for fetching templates with per-user rate limiting
     */
    public function get_templates_ajax() {
        check_ajax_referer('htmega_actication_verifynonce', 'nonce');

        $force_refresh = false;

        // Check if this is a manual refresh request
        $is_manual_refresh = isset($_POST['manual_refresh']) && $_POST['manual_refresh'] === 'true';

        if ($is_manual_refresh) {
            // Production: 24-hour limit per user for manual refresh
            $refresh_limit_seconds = 86400; // 24 hours in seconds

            // Check if user already refreshed in the last 24 hours
            $last_user_refresh = get_transient('htmega_user_refresh_' . get_current_user_id());

            if ($last_user_refresh) {
                // User already refreshed within 24 hours, return cached data
                $cached = get_transient(self::TRANSIENT_KEY);

                // Calculate time remaining until next refresh allowed
                $time_passed = time() - (int)$last_user_refresh;
                $time_remaining = $refresh_limit_seconds - $time_passed;
                $hours_remaining = ceil($time_remaining / 3600);

                if ($cached && !empty($cached)) {
                    wp_send_json_success([
                        'templates' => $cached,
                        'message' => sprintf(
                            __('You can refresh templates once every 24 hours. Next refresh available in %d hours.', 'htmega-addons'),
                            $hours_remaining
                        ),
                        'cached' => true
                    ]);
                    return;
                }
            }

            // Check if we're in a server failure backoff period
            if (get_transient('htmega_api_backoff')) {
                $failure_count = get_transient('htmega_api_failure_count');
                $retry_after = $failure_count ? min(60 * pow(2, $failure_count - 3), 360) : 60;

                $cached = get_transient(self::TRANSIENT_KEY);
                if ($cached && !empty($cached)) {
                    wp_send_json_success([
                        'templates' => $cached,
                        'message' => sprintf(
                            __('Template server is temporarily unavailable. Showing cached data. Server will be checked again in %d minutes.', 'htmega-addons'),
                            $retry_after
                        ),
                        'cached' => true
                    ]);
                    return;
                }

                wp_send_json_error([
                    'message' => __('Template server is temporarily unavailable. Please try again later.', 'htmega-addons'),
                    'retry_after' => $retry_after
                ]);
                return;
            }

            // User can refresh - set the timestamp and force update
            set_transient('htmega_user_refresh_' . get_current_user_id(), time(), 86400);
            $force_refresh = true;

        } else {
            // Regular page load - check for weekly auto-refresh
            $last_auto_refresh = (int) get_option('htmega_api_last_req');
            $week_in_seconds = 604800;

            if (!$last_auto_refresh || (time() > $last_auto_refresh + $week_in_seconds)) {
                // Only auto-refresh if not in backoff
                if (!get_transient('htmega_api_backoff')) {
                    update_option('htmega_api_last_req', time());
                    $force_refresh = true;
                }
            }
        }

        // Get template info (with caching and rate limiting)
        $template_info = $this->get_templates_info($force_refresh);

        if ($template_info && !empty($template_info)) {
            wp_send_json_success($template_info);
        } else {
            // If no data, return cached data if available
            $cached = get_transient(self::TRANSIENT_KEY);
            if ($cached && !empty($cached)) {
                wp_send_json_success($cached);
            } else {
                wp_send_json_error([
                    'message' => __('Unable to load templates at this time. Please try again later.', 'htmega-addons')
                ]);
            }
        }
    }

    // Setter Endpoint
    function set_api_endpoint( $endpoint ){
        self::$endpoint = $endpoint;
    }
    
    // Setter Template API
    function set_api_templateapi( $templateapi ){
        self::$templateapi = $templateapi;
    }

    // Get Endpoint
    public static function get_api_endpoint(){
        if( is_plugin_active('htmega-pro/htmega_pro.php') && function_exists('htmega_pro_template_endpoint') ){
            self::$endpoint = htmega_pro_template_endpoint();
        }
        return self::$endpoint;
    }
    
    // Get Template API
    public static function get_api_templateapi(){
        if( is_plugin_active('htmega-pro/htmega_pro.php') && function_exists('htmega_pro_template_url') ){
            self::$templateapi = htmega_pro_template_url();
        }
        return self::$templateapi;
    }

    // Plugins Library Register
    function admin_menu() {
        add_submenu_page(
            'htmega-addons', 
            esc_html__( 'Templates Library', 'htmega-addons' ),
            esc_html__( 'Templates Library', 'htmega-addons' ), 
            'manage_options', 
            'htmega-addons#/templates', 
            [ $this, 'library_render_html' ] 
        );
    }
    function library_render_html(){
        if( apply_filters( 'htmega_use_vue_template_library', true ) ) {
            // Add wrapper div with specific class for styling
            echo '<div class="wrap htmega-template-admin-page">';
            echo '<div id="htmega-template-library-app" class="htmega-template-library-wrapper"></div>';
            echo '</div>';
            return;
        }

        $template_data = HTMega_Addons_Elementor::$template_info;
        if(is_array($template_data) && isset($template_data['templates'])){
            require_once HTMEGA_ADDONS_PL_PATH . 'admin/include/templates_list.php';
        }else{
            ?>
                <div class="htmega-template-library">
                  <div class="htmega-library-warning-image">
                      <img src="<?php echo esc_url( HTMEGA_ADDONS_PL_URL.'admin/assets/images/warning-icon.png' ); ?>">
                  </div>
                  <h2>
                    <?php echo esc_html__( 'No data found','htmega-addons' ); ?>
                  </h2>
                  <p><?php echo esc_html__( 'Please wait a few moments, this may be the causes of server issues.','htmega-addons' ); ?></p>
                </div> 
            <?php
        }
    }

    // Get Buy Now link
    function get_pro_link(){
        return self::$buylink;
    }

    /**
     * Initialize WP_Filesystem
     */
    private static function init_filesystem() {
        global $wp_filesystem;

        if ( ! $wp_filesystem || ! is_object( $wp_filesystem ) ) {
            if ( ! function_exists( 'WP_Filesystem' ) ) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
            }

            $upload_dir = wp_upload_dir();
            WP_Filesystem( false, $upload_dir['basedir'], true );
        }

        return ( $wp_filesystem && is_object( $wp_filesystem ) );
    }

    /**
     * Get cache directory path
     */
    public static function get_cache_dir() {
        $upload_dir = wp_upload_dir();
        return trailingslashit( $upload_dir['basedir'] ) . self::CACHE_DIR . '/cache';
    }

    /**
     * Get cache file path
     */
    public static function get_cache_file_path() {
        return trailingslashit( self::get_cache_dir() ) . self::CACHE_FILE;
    }

    /**
     * Get cache meta file path
     */
    public static function get_cache_meta_path() {
        return trailingslashit( self::get_cache_dir() ) . self::CACHE_META_FILE;
    }

    /**
     * Create cache directory if not exists
     */
    public static function create_cache_dir() {
        global $wp_filesystem;

        if ( ! self::init_filesystem() ) {
            return false;
        }

        $upload_dir = wp_upload_dir();
        $plugin_dir = trailingslashit( $upload_dir['basedir'] ) . self::CACHE_DIR;
        $cache_dir  = self::get_cache_dir();

        // Create parent plugin directory if not exists
        if ( ! $wp_filesystem->exists( $plugin_dir ) ) {
            wp_mkdir_p( $plugin_dir );
            $wp_filesystem->put_contents( trailingslashit( $plugin_dir ) . 'index.php', '<?php // Silence is golden', FS_CHMOD_FILE );
        }

        // Create cache directory if not exists
        if ( ! $wp_filesystem->exists( $cache_dir ) ) {
            $created = wp_mkdir_p( $cache_dir );

            if ( $created ) {
                // Create .htaccess for security
                $htaccess_content = "Options -Indexes\n<Files *.json>\n    Order Allow,Deny\n    Allow from all\n</Files>";
                $wp_filesystem->put_contents( trailingslashit( $cache_dir ) . '.htaccess', $htaccess_content, FS_CHMOD_FILE );

                // Create index.php for security
                $wp_filesystem->put_contents( trailingslashit( $cache_dir ) . 'index.php', '<?php // Silence is golden', FS_CHMOD_FILE );
            }
        }

        return $wp_filesystem->is_dir( $cache_dir ) && $wp_filesystem->is_writable( $cache_dir );
    }

    /**
     * Save data to cache file
     */
    public static function save_cache_file( $data ) {
        global $wp_filesystem;

        if ( ! self::create_cache_dir() ) {
            return false;
        }

        $file_path = self::get_cache_file_path();
        $json_data = wp_json_encode( $data );

        $saved = $wp_filesystem->put_contents( $file_path, $json_data, FS_CHMOD_FILE );

        if ( $saved ) {
            self::update_cache_meta( strlen( $json_data ) );
            return true;
        }

        return false;
    }

    /**
     * Update cache meta information
     */
    public static function update_cache_meta( $size = 0 ) {
        global $wp_filesystem;

        if ( ! self::init_filesystem() ) {
            return;
        }

        $meta_path = self::get_cache_meta_path();
        $meta = [];

        if ( $wp_filesystem->exists( $meta_path ) ) {
            $meta_content = $wp_filesystem->get_contents( $meta_path );
            if ( $meta_content !== false ) {
                $meta = json_decode( $meta_content, true ) ?: [];
            }
        }

        $meta['template'] = [
            'timestamp' => time(),
            'version'   => HTMEGA_VERSION,
            'size'      => $size
        ];

        $wp_filesystem->put_contents( $meta_path, wp_json_encode( $meta ), FS_CHMOD_FILE );
    }

    /**
     * Read data from cache file
     */
    public static function get_cache_file() {
        global $wp_filesystem;

        if ( ! self::init_filesystem() ) {
            return null;
        }

        $file_path = self::get_cache_file_path();

        if ( ! $wp_filesystem->exists( $file_path ) ) {
            return null;
        }

        $content = $wp_filesystem->get_contents( $file_path );

        if ( $content === false ) {
            return null;
        }

        return json_decode( $content, true );
    }

    /**
     * Check if cache is valid (not expired)
     */
    public static function is_cache_valid() {
        global $wp_filesystem;

        if ( ! self::init_filesystem() ) {
            return false;
        }

        $file_path = self::get_cache_file_path();

        if ( ! $wp_filesystem->exists( $file_path ) ) {
            return false;
        }

        $meta_path = self::get_cache_meta_path();

        if ( ! $wp_filesystem->exists( $meta_path ) ) {
            // Fallback to filemtime if meta doesn't exist
            $file_time = filemtime( $file_path );
            return ( time() - $file_time ) < self::CACHE_EXPIRY;
        }

        $meta_content = $wp_filesystem->get_contents( $meta_path );
        if ( $meta_content === false ) {
            return false;
        }

        $meta = json_decode( $meta_content, true );

        if ( ! isset( $meta['template']['timestamp'] ) ) {
            // Fallback to filemtime if timestamp not in meta
            $file_time = filemtime( $file_path );
            return ( time() - $file_time ) < self::CACHE_EXPIRY;
        }

        return ( time() - $meta['template']['timestamp'] ) < self::CACHE_EXPIRY;
    }

    /**
     * Clear cache files
     */
    public static function clear_cache() {
        global $wp_filesystem;

        if ( ! self::init_filesystem() ) {
            return false;
        }

        $cache_dir = self::get_cache_dir();

        if ( ! $wp_filesystem->is_dir( $cache_dir ) ) {
            return true;
        }

        $file_path = self::get_cache_file_path();
        if ( $wp_filesystem->exists( $file_path ) ) {
            $wp_filesystem->delete( $file_path );
        }
        
        // Clear meta file
        $meta_path = self::get_cache_meta_path();
        if ( $wp_filesystem->exists( $meta_path ) ) {
            $wp_filesystem->delete( $meta_path );
        }

        return true;
    }

    public static function request_remote_templates_info( $force_update ) {
        global $wp_version;

        // Check if we should skip the request due to recent failures
        if (!$force_update) {
            $failure_count = get_transient('htmega_api_failure_count');
            if ($failure_count !== false && $failure_count >= 3) {
                // If we've failed 3+ times, check if backoff period has passed
                if (get_transient('htmega_api_backoff')) {
                    return [];
                }
            }
        } else {
            // Force update clears failure tracking
            delete_transient('htmega_api_failure_count');
            delete_transient('htmega_api_backoff');
            delete_transient('htmega_severdown_request_pending');
        }

        $timeout = ( $force_update ) ? 25 : 8;
        $request = wp_remote_get(
            self::get_api_endpoint(),
            [
                'timeout'    => $timeout,
                'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url(),
                'sslverify'  => true,
            ]
        );

        if ( is_wp_error( $request ) || 200 !== (int) wp_remote_retrieve_response_code( $request ) ) {
            // Track failure count
            $failure_count = get_transient('htmega_api_failure_count');
            $failure_count = ($failure_count === false) ? 1 : $failure_count + 1;
            set_transient('htmega_api_failure_count', $failure_count, 12 * HOUR_IN_SECONDS);

            // Implement exponential backoff
            if ($failure_count >= 3) {
                $backoff_time = min(60 * pow(2, $failure_count - 3), 360); // 1, 2, 4... up to 6 hours
                set_transient('htmega_api_backoff', true, $backoff_time * MINUTE_IN_SECONDS);
            }

            // Set general server down flag for backward compatibility
            set_transient('htmega_severdown_request_pending', 'Pending request for server down', 60 * MINUTE_IN_SECONDS);
            return [];
        }

        // Clear failure tracking on successful request
        delete_transient('htmega_api_failure_count');
        delete_transient('htmega_api_backoff');
        delete_transient('htmega_severdown_request_pending');

        $response = json_decode( wp_remote_retrieve_body( $request ), true );
        return $response;

    }

    /**
     * Retrieve template library and save as a transient.
     */
    public static function set_templates_info( $force_update = false ) {
        $info = self::request_remote_templates_info( $force_update );
    
        // Always set something so subsequent calls see the cache (even if empty).
        if ( null === $info ) {
            $info = [];
        }
        
        // Save to file cache
        self::save_cache_file( $info );

        // Clear usage of transient
        delete_transient( self::TRANSIENT_KEY );
    }

    /**
     * Get template info with intelligent caching and retry logic.
     */
    public function get_templates_info( $force_update = false ) {
        // First, check if we have cached data
        $cached = null;
        if ( self::is_cache_valid() ) {
            $cached = self::get_cache_file();
        }

        // If forcing update, always try to fetch fresh data
        if ( $force_update ) {
            self::set_templates_info( true );
            $cached = self::get_cache_file();
        }
        // If no cache exists and not in backoff period, try to fetch
        elseif ( empty( $cached ) ) {
            // Check if we're in a backoff period before making request
            if ( ! get_transient('htmega_api_backoff') ) {
                self::set_templates_info( false );
                $cached = self::get_cache_file();
            }
        }
        
        // Backward compatibility migration: If no file cache, check transient
        if ( empty($cached) ) {
            $transient_data = get_transient( self::TRANSIENT_KEY );
            if ( ! empty($transient_data) ) {
                $cached = $transient_data;
                self::save_cache_file( $cached );
                delete_transient( self::TRANSIENT_KEY );
            }
        }

        // Return cached data (could be empty array if API is down)
        return $cached ? $cached : [];
    }
    /**
     * Ajax request.
     */
    function templates_ajax_request(){
        
        check_ajax_referer('htmega_actication_verifynonce', 'plgactivenonce');

        if ( isset( $_REQUEST ) ) {

            $template_id        = sanitize_text_field( $_REQUEST['httemplateid'] );
            $template_parentid  = sanitize_text_field( $_REQUEST['htparentid'] );
            $template_title     = sanitize_text_field( $_REQUEST['httitle'] );
            $page_title         = sanitize_text_field( $_REQUEST['pagetitle'] );

            $templateurl    = sprintf( self::get_api_templateapi(), $template_id );
            $response_data  = $this->templates_get_content_remote_request( $templateurl );
            $defaulttitle   = ucfirst( $template_parentid ) .' -> '.$template_title;

            $args = [
                'post_type'    => !empty( $page_title ) ? 'page' : 'elementor_library',
                'post_status'  => !empty( $page_title ) ? 'draft' : 'publish',
                'post_title'   => !empty( $page_title ) ? $page_title : $defaulttitle,
                'post_content' => '',
            ];

            $new_post_id = wp_insert_post( $args );

            if ( isset( $response_data['content']['content'] ) ) {
                update_post_meta( $new_post_id, '_elementor_data', $response_data['content']['content'] );
            }
            if ( isset( $response_data['type'] ) ) {
                update_post_meta( $new_post_id, '_elementor_template_type', $response_data['type'] );
            }
           
            update_post_meta( $new_post_id, '_elementor_edit_mode', 'builder' );
            
            if( isset( $response_data['page_settings'] ) ){
                update_post_meta( $new_post_id, '_elementor_page_settings', $response_data['page_settings'] );
            }

            if ( $new_post_id && ! is_wp_error( $new_post_id ) ) {
                update_post_meta( $new_post_id, '_wp_page_template', !empty( $response_data['page_template'] ) ? $response_data['page_template'] : 'elementor_canvas' );
            }

            echo wp_json_encode(
                array( 
                    'id'      => $new_post_id,
                    'edittxt' => !empty( $page_title ) ? esc_html__( 'Edit Page', 'htmega-addons' ) : esc_html__( 'Edit Template', 'htmega-addons' )
                )
            );
        }

        wp_die();
    }

    /*
    * Remote data
    */
    public function templates_get_content_remote_request( $templateurl ){
        global $wp_version;

        $response = wp_remote_get( $templateurl, array(
            'timeout'    => 25,
            'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url()
        ) );

        if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
            return [];
        }

        $result = json_decode( wp_remote_retrieve_body( $response ), true );
        return $result;

    }

    /*
    * Ajax response required data
    */
    public function ajax_plugin_data(){
        check_ajax_referer('htmega_actication_verifynonce', 'plgactivenonce');
        
        $response = array(
            'success' => false,
            'data' => array(
                'free' => array(),
                'pro' => array()
            )
        );

        if ( isset( $_POST ) ) {
            $freeplugins = !empty($_POST['freeplugins']) ? explode( ',', sanitize_text_field($_POST['freeplugins']) ) : array();
            $proplugins = !empty($_POST['proplugins']) ? explode( ',', sanitize_text_field($_POST['proplugins']) ) : array();
            
            if(!empty($freeplugins)){
                $response['data']['free'] = $this->required_plugins( $freeplugins, 'free' );
            }
            if(!empty($proplugins)){ 
                $response['data']['pro'] = $this->required_plugins( $proplugins, 'pro' );
            }
            
            $response['success'] = true;
        }

        wp_send_json($response);
        wp_die();
    }

    /*
    * Required Plugins
    */
    public function required_plugins( $plugins, $type ) {
        $plugin_data = array();
        foreach ( $plugins as $key => $plugin ) {

            $plugindata = explode( '//', $plugin );
            $data = array(
                'slug'      => isset( $plugindata[0] ) ? $plugindata[0] : '',
                'location'  => isset( $plugindata[1] ) ? $plugindata[0].'/'.$plugindata[1] : '',
                'name'      => isset( $plugindata[2] ) ? $plugindata[2] : '',
                'pllink'    => isset( $plugindata[3] ) ? 'https://'.$plugindata[3] : '#',
            );

            if ( ! is_wp_error( $data ) ) {

                // Installed but Inactive.
                if ( file_exists( WP_PLUGIN_DIR . '/' . $data['location'] ) && is_plugin_inactive( $data['location'] ) ) {
                    $data['status'] = 'inactive';
                    $data['button_text'] = __( 'Activate', 'htmega-addons' );
                // Not Installed.
                } elseif ( ! file_exists( WP_PLUGIN_DIR . '/' . $data['location'] ) ) {
                    $data['status'] = 'not-installed';
                    $data['button_text'] = __( 'Install Now', 'htmega-addons' );
                // Active.
                } else {
                    $data['status'] = 'active';
                    $data['button_text'] = __( 'Activated', 'htmega-addons' );
                }
                
                $data['type'] = $type;
                $plugin_data[] = $data;
            }
        }
        return $plugin_data;
    }

    /**
     * Ajax plugins activation request
     */
    public function ajax_plugin_activation() {
        check_ajax_referer('htmega_actication_verifynonce', 'plgactivenonce');

        if ( ! current_user_can( 'install_plugins' ) ) {
            wp_send_json_error(
                array(
                    'success' => false,
                    'message' => esc_html__( 'You do not have permission to install plugins', 'htmega-addons' ),
                )
            );
        }

        $plugin_data = isset( $_POST['plugindata'] ) ? json_decode( stripslashes( $_POST['plugindata'] ), true ) : array();
        error_log('Plugin activation request data: ' . print_r($plugin_data, true));

        if ( empty( $plugin_data['location'] ) ) {
            wp_send_json_error(
                array(
                    'success' => false,
                    'message' => esc_html__( 'Plugin location not provided', 'htmega-addons' ),
                )
            );
        }

        $plugin_file = $plugin_data['location'];
        $plugin_path = WP_PLUGIN_DIR . '/' . $plugin_file;

        if ( ! file_exists( $plugin_path ) ) {
            wp_send_json_error(
                array(
                    'success' => false,
                    'message' => esc_html__( 'Plugin file not found', 'htmega-addons' ),
                )
            );
        }

        $activate = activate_plugin( $plugin_file, '', false, true );

        if ( is_wp_error( $activate ) ) {
            error_log('Plugin activation error: ' . $activate->get_error_message());
            wp_send_json_error(
                array(
                    'success' => false,
                    'message' => $activate->get_error_message(),
                )
            );
        }

        wp_send_json_success(
            array(
                'success' => true,
                'message' => esc_html__( 'Plugin Successfully Activated', 'htmega-addons' ),
            )
        );
    }

    /*
    * Required Theme
    */
    public function required_theme( $themes, $type ){
        foreach ( $themes as $key => $theme ) {
            $themedata = explode( '//', $theme );
            $data = array(
                'slug'      => isset( $themedata[0] ) ? $themedata[0] : '',
                'name'      => isset( $themedata[1] ) ? $themedata[1] : '',
                'prolink'   => isset( $themedata[2] ) ? $themedata[2] : '',
            );

            if ( ! is_wp_error( $data ) ) {

                $theme = wp_get_theme();

                // Installed but Inactive.
                if ( file_exists( get_theme_root(). '/' . $data['slug'] . '/functions.php' ) && ( $theme->stylesheet != $data['slug'] ) ) {

                    $button_classes = 'button themeactivate-now button-primary';
                    $button_text    = __( 'Activate', 'htmega-addons' );

                // Not Installed.
                } elseif ( ! file_exists( get_theme_root(). '/' . $data['slug'] . '/functions.php' ) ) {

                    $button_classes = 'button themeinstall-now';
                    $button_text    = __( 'Install Now', 'htmega-addons' );

                // Active.
                } else {
                    $button_classes = 'button disabled';
                    $button_text    = __( 'Activated', 'htmega-addons' );
                }

                ?>
                    <li class="htwptemplata-theme-<?php echo esc_attr( $data['slug'] ); ?>">
                        <h3><?php echo esc_html($data['name']); ?></h3>
                        <?php
                            if ( !empty( $data['prolink'] ) ) {
                                echo '<a class="button" href="'.esc_url( $data['prolink'] ).'" target="_blank">'.esc_html__( 'Buy Now', 'htmega-addons' ).'</a>';
                            }else{
                        ?>
                            <button class="<?php echo esc_attr($button_classes); ?>" data-themeopt='<?php echo wp_json_encode( $data ); ?>'><?php echo esc_html($button_text); ?></button>
                        <?php } ?>
                    </li>
                <?php
            }


        }

    }

    /*
    * Required Theme Activation Request
    */
    function ajax_theme_activation() {
        check_ajax_referer('htmega_actication_verifynonce', 'plgactivenonce');

        if ( ! current_user_can( 'install_themes' ) || ! isset( $_POST['themeslug'] ) || ! $_POST['themeslug'] ) {
            wp_send_json_error(
                array(
                    'success' => false,
                    'message' => esc_html__( 'Sorry, you are not allowed to install themes on this site.', 'htmega-addons' ),
                )
            );
        }

        $theme_slug = ( isset( $_POST['themeslug'] ) ) ? esc_attr( $_POST['themeslug'] ) : '';
        switch_theme( $theme_slug );

        wp_send_json_success(
            array(
                'success' => true,
                'message' => __( 'Theme Activated', 'htmega-addons' ),
            )
        );
    }


}

HTMega_Template_Library::instance();