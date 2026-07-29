<?php  
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class HTMega_Notice_Manager{

    // Remote URL
    const REST_ROUTE_URL = 'https://feed.hasthemes.com/notices/htmega';
    //const REST_ROUTE_URL = HTMEGA_ADDONS_PL_URL; // for local file test

    // Transient Key
    const TRANSIENT_KEYS = [
        'notice'  => 'htmega_notice_info',
    ];

    // API Endpoint
    const API_ENDPOINT = [
        'notice'      => 'htmega-notice.json',
    ];

    private static $_instance = null;
    /**
     * Class Instance
     */
    public static function instance(){
        if( is_null( self::$_instance ) ){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Get Notice Endpoint
     */
    public static function get_api_endpoint(){
        if( is_plugin_active('htmega-pro/htmega_pro.php') && function_exists('htmega_pro_notice_endpoint') ){
            return htmega_pro_notice_endpoint();
        }
        return self::get_remote_url('notice');
    }

    /**
     * Delete Remote Data Fetching cache
     * @return void
     */
    public static function delete_transient_cache_data(){
        if ( get_option( 'htmega_delete_data_fetch_cache', FALSE ) ) {
            foreach( self::TRANSIENT_KEYS as $transient_key ){
                delete_transient( $transient_key );
            }
            delete_option('htmega_delete_data_fetch_cache');
        }
    }

    /**
     * Get Remote URL
     *
     * @param [type] $name
     */
    public static function get_remote_url( $name ){
        return sprintf('%s/%s', self::REST_ROUTE_URL, self::API_ENDPOINT[$name]);
    }

    /**
     * Set data to transient
     *
     * @param string $url
     * @param string $transient_key
     * @param boolean $force_update
     */
    public static function set_notice_info( $url = '', $transient_key = '', $force_update = false ) {
        $transient = get_transient( $transient_key );
        if ( ! $transient || $force_update ) {
            $info = self::get_content_remote_request( $url );
            //set_transient( $transient_key, wp_json_encode( $info ), 7 * DAY_IN_SECONDS );
            set_transient( $transient_key, wp_json_encode( $info ), 2 * MINUTE_IN_SECONDS );
        }
    }

    /**
     * Get Remote Notice List
     *
     * @param [type] $type
     * @param [type] $endpoint
     * @param boolean $force_update
     */
    public static function get_notice_remote_data( $type, $endpoint = null, $force_update = false ){
        self::delete_transient_cache_data();

        $transient_key  = self::TRANSIENT_KEYS[$type];
        $endpoint       = $endpoint !== null ? $endpoint : self::get_remote_url($type);
        if ( !get_transient( $transient_key ) || $force_update ) {
            self::set_notice_info( $endpoint, $transient_key, true );
        }
        return is_array( get_transient( $transient_key ) ) ? get_transient( $transient_key ) : json_decode( get_transient( $transient_key ), JSON_OBJECT_AS_ARRAY );
    }

    /**
     * Get Notice List
     *
     * @param boolean $force_update
     */
    public static function get_notices_info($force_update = false) {

        $notice_data = self::get_notice_remote_data('notice', self::get_api_endpoint(), $force_update);
        
        if (is_array( $notice_data ) && isset($notice_data['notices'])){
            return $notice_data['notices'];
        }
        return self::get_notice_remote_data('notice', self::get_api_endpoint(), $force_update);
    }
    /**
     * Get Sidebar banner
     *
     * @param boolean $force_update
     */
    public static function get_sidebar_info( $force_update = false ) {

        $notice_data = self::get_notice_remote_data( 'notice', self::get_api_endpoint(), $force_update );
        
        if ( is_array( $notice_data ) && isset( $notice_data['sidebar'] ) ) {
            return $notice_data['sidebar'];
        }
        return [];
    }



    /**
     * Get Notice content by Notice ID
     *
     * @param [type] $type notice | gutenberg | pattern
     * @param [type] $notice_id
     */
    public static function get_notice_data( $type, $notice_id ){
        $notice_url    = sprintf( '%s/%s', self::get_remote_url($type), $notice_id);
        $response_data  = self::get_content_remote_request( $notice_url );
        return $response_data;
    }

    /**
     * Handle remote request
     *
     * @param [type] $request_url
     */
    public static function get_content_remote_request( $request_url ){
        global $wp_version;

        $response = wp_remote_get( 
			$request_url,
			array(
				'timeout'    => 25,
				'user-agent' => 'WordPress/' . $wp_version . '; ' . home_url()
			) 
		);

        if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
            return [];
        }

        $result = json_decode( wp_remote_retrieve_body( $response ), true );
        return $result;

    }


}