<?php
/**
 * Plugin Name: HT Mega Addons for Elementor - Elementor Widgets & Template Builder
 * Description: Elementor addon offering 135+ widgets — Mega Menu, Ready Templates, Page Builder, Slider, Gallery, Post Grid, AI Writer & more.
 * Plugin URI: 	https://wphtmega.com/
 * Author: 		HasThemes
 * Author URI: 	https://hasthemes.com/
 * Version: 	3.0.8
 * License:     GPL2
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: htmega-addons
 * Domain Path: /languages
 * Elementor tested up to: 4.0.1
 * Elementor Pro tested up to: 4.0.1
*/

if( ! defined( 'ABSPATH' ) ) exit(); // Exit if accessed directly
define( 'HTMEGA_VERSION', '3.0.8' );
define( 'HTMEGA_ADDONS_PL_ROOT', __FILE__ );
define( 'HTMEGA_ADDONS_PL_URL', plugins_url( '/', HTMEGA_ADDONS_PL_ROOT ) );
define( 'HTMEGA_ADDONS_PL_PATH', plugin_dir_path( HTMEGA_ADDONS_PL_ROOT ) );
define( 'HTMEGA_ADDONS_PLUGIN_BASE', plugin_basename( HTMEGA_ADDONS_PL_ROOT ) );


/**
 * Gutenberg Blocks
 */
require_once ( HTMEGA_ADDONS_PL_PATH.'htmega-blocks/htmega-blocks.php' );

// Required File
require_once ( HTMEGA_ADDONS_PL_PATH .'includes/class.htmega.php' );
htmega();