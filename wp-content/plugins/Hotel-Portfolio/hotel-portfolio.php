<?php
/**
 * Plugin Name: Hotel Portfolio
 * Plugin URI: https://hrg-hotels.com
 * Description: Ein Plugin zur Verwaltung von Hotelportfolios.
 * Version: 1.0.0
 * Author: Stephan Leins
 * License: GPL-2.0+
 * Text Domain: hotel-portfolio
 * Domain Path: /languages
 */

// Verhindere direkten Zugriff auf die Datei.
defined('ABSPATH') or exit;

/**
 * Konstanten definieren
 */
define('HOTEL_PORTFOLIO_VERSION', '1.0.0');
define('HOTEL_PORTFOLIO_DIR', plugin_dir_path(__FILE__));
define('HOTEL_PORTFOLIO_URL', plugin_dir_url(__FILE__));

/**
 * Plugin-Deaktivierung.
 */
function hotel_portfolio_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'hotel_portfolio_deactivate');

/**
 * Plugin-Initialisierung: Übersetzungen laden.
 */
function hotel_portfolio_init() {
    load_plugin_textdomain('hotel-portfolio', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'hotel_portfolio_init');

/**
 * Admin-Menü hinzufügen.
 */
function hotel_portfolio_add_admin_menu() {
    add_menu_page(
        __('Hotel Portfolio', 'hotel-portfolio'),
        __('Hotel Portfolio', 'hotel-portfolio'),
        'manage_options',
        'hotel-portfolio',
        'hotel_portfolio_admin_page',
        'dashicons-building',
        20
    );
}
add_action('admin_menu', 'hotel_portfolio_add_admin_menu');

/**
 * Admin-Seiteninhalt.
 */
function hotel_portfolio_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Hotel Portfolio Einstellungen', 'hotel-portfolio'); ?></h1>
        <p><?php esc_html_e('Hier kommen die Einstellungen und die Dokumentation', 'hotel-portfolio'); ?></p>
        <a href="https://client-hrg-hotels-staging.wemakefuture.com/form/c89fd1f7-89cb-464c-ab1a-8cb0cc74973d" class="button button-primary"><?php esc_html_e('Chronos Daten Sync', 'hotel-portfolio'); ?></a>
    </div>
    <?php
}

/**
 * Sicherer AJAX-Handler zum Abrufen der Hotel-Daten.
 */
function hotel_portfolio_fetch_data() {
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
        wp_send_json_error(__('Keine Daten gefunden.', 'hotel-portfolio'));
    }
}
add_action('wp_ajax_hotel_portfolio_fetch', 'hotel_portfolio_fetch_data');
add_action('wp_ajax_nopriv_hotel_portfolio_fetch', 'hotel_portfolio_fetch_data');


/**
 * JavaScript und Styles sicher einbinden.
 */
function hotel_portfolio_enqueue_scripts() {
    if (is_page(array('hotels', 'pga'))) {
        wp_enqueue_style('hotel-portfolio-style', HOTEL_PORTFOLIO_URL . 'assets/portfolio-template.css', array(), HOTEL_PORTFOLIO_VERSION);
        wp_enqueue_script('hotel-portfolio-ajax', HOTEL_PORTFOLIO_URL . 'assets/portfolio-template.js', array('jquery'), null, true);
        
        wp_localize_script('hotel-portfolio-ajax', 'hotelPortfolio', array(
            'ajaxurl' => admin_url('admin-ajax.php')
        ));

        wp_enqueue_style('hotel-portfolio-filter', HOTEL_PORTFOLIO_URL . 'assets/hotelfilter/filter.css', array(), HOTEL_PORTFOLIO_VERSION);
        wp_enqueue_script('hotel-portfolio-filter', HOTEL_PORTFOLIO_URL . 'assets/hotelfilter/filter.js', array('jquery'), null, true);
    }
}
add_action('wp_enqueue_scripts', 'hotel_portfolio_enqueue_scripts');

/**
 * Shortcode für die Hotel-Grid-Anzeige mit Template-Einbindung.
 */
function hotel_portfolio_display_grid() {
    ob_start();
    include HOTEL_PORTFOLIO_DIR . 'assets/portfolio-template.php';
    return ob_get_clean();
}
add_shortcode('hotel_portfolio', 'hotel_portfolio_display_grid');

