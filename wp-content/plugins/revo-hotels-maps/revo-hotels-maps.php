<?php
/*
Plugin Name: Revo Hotels Maps
Description: Adds a Google Map with hotel locations using shortcode [revo_hotels_map].
Version: 1.0.0
Author: Stephan Leins
License: GPL-2.0+
Text Domain: revo-hotels-maps
*/

if ( ! defined('ABSPATH') ) exit; // Exit if accessed directly

// Define constants
define('REVO_HOTELS_MAPS_VERSION', '1.0.0');
define('REVO_HOTELS_MAPS_DIR', plugin_dir_path(__FILE__));
define('REVO_HOTELS_MAPS_URL', plugin_dir_url(__FILE__));

// Load translations
add_action('init', function() {
    load_plugin_textdomain('revo-hotels-maps', false, dirname(plugin_basename(__FILE__)) . '/languages');
});

// Flush rewrite rules on deactivation
register_deactivation_hook(__FILE__, function() {
    flush_rewrite_rules();
});

// Add admin menu
add_action('admin_menu', function() {
    add_menu_page(
        __('Revo Hotels Maps', 'revo-hotels-maps'),
        __('Revo Hotels Maps', 'revo-hotels-maps'),
        'manage_options',
        'revo-hotels-maps',
        'revo_hotels_maps_admin_page',
        'dashicons-location-alt',
        20
    );
});

function revo_hotels_maps_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Revo Hotels Maps Settings', 'revo-hotels-maps'); ?></h1>
        <p><?php esc_html_e('Here you can manage settings and view documentation for the Revo Hotels Maps plugin.', 'revo-hotels-maps'); ?></p>
        <a href="https://client-hrg-hotels-staging.wemakefuture.com/form/c89fd1f7-89cb-464c-ab1a-8cb0cc74973d" class="button button-primary" target="_blank">
            <?php esc_html_e('Chronos Data Sync', 'revo-hotels-maps'); ?>
        </a>
    </div>
    <?php
}

// Enqueue assets (CSS + JS)
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'revo-hotels-maps-css',
        plugins_url('assets/maps-template.css', __FILE__), 
        [],
        REVO_HOTELS_MAPS_VERSION
    );

    wp_enqueue_script(
        'revo-hotels-maps-js',
        plugins_url('assets/maps-template.js', __FILE__),
        [],
        REVO_HOTELS_MAPS_VERSION,
        true
    );

    wp_localize_script('revo-hotels-maps-js', 'revoHotelsMaps', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'lang'     => get_locale()
    ]);
});

// AJAX: Fetch hotel data
add_action('wp_ajax_revo_hotels_maps_fetch', 'revo_hotels_maps_fetch_data');
add_action('wp_ajax_nopriv_revo_hotels_maps_fetch', 'revo_hotels_maps_fetch_data');

function revo_hotels_maps_fetch_data() {
    global $wpdb;
    $lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : 'en';

    $results = $wpdb->get_results($wpdb->prepare("
        SELECT 
            h.image,
            h.name,
            COALESCE(ct.translation, h.country_code, 'Unknown') AS country, 
            h.zip,
            COALESCE(cty.translation, h.city, 'Unknown') AS city, 
            h.street,
            h.phone,
            h.email,
            h.homepage AS website,
            h.port_prio AS order_prio,
            h.lat,
            h.lon AS lng,
            COALESCE(h.brand, 'Unknown') AS brand, 
            COALESCE(h.parent_brand, 'Unknown') AS parent_brand, 
            h.publication_status
        FROM {$wpdb->prefix}hotel_portfolio_04 h
        LEFT JOIN {$wpdb->prefix}hotel_translation ct 
            ON ct.code = h.country_code AND ct.lang = %s AND ct.type = 'country'
        LEFT JOIN {$wpdb->prefix}hotel_translation cty 
            ON cty.code = h.city AND cty.lang = %s AND cty.type = 'city'
        ORDER BY order_prio ASC, h.name ASC
    ", $lang, $lang), ARRAY_A);

    if ($results) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error(__('No data found.', 'revo-hotels-maps'));
    }
}

// Shortcode: Display map with template
function revo_hotels_map_grid() {
    ob_start();
    include REVO_HOTELS_MAPS_DIR . 'assets/maps-template.php';
    return ob_get_clean();
}
add_shortcode('revo_hotels_map', 'revo_hotels_map_grid');
