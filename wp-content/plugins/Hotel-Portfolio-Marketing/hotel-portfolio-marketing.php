<?php
/**
 * Plugin Name: Hotel-Portfolio-Marketing
 * Plugin URI: https://revo-hospitality.com
 * Description: Ein Plugin zur Verwaltung und Vermarktung von Hotelportfolios inkl. Angebotsdaten (Marketing).
 * Version: 1.0.0
 * Author: Stephan Leins
 * License: GPL-2.0+
 * Text Domain: hotel-portfolio-marketing
 * Domain Path: /languages
 */

defined('ABSPATH') or exit;

// Konstanten
define('HOTEL_PORTFOLIO_MARKETING_VERSION', '1.0.0');
define('HOTEL_PORTFOLIO_MARKETING_DIR', plugin_dir_path(__FILE__));
define('HOTEL_PORTFOLIO_MARKETING_URL', plugin_dir_url(__FILE__));

// Plugin-Deaktivierung
function hotel_portfolio_marketing_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'hotel_portfolio_marketing_deactivate');

// Übersetzungen laden
function hotel_portfolio_marketing_init() {
    load_plugin_textdomain('hotel-portfolio-marketing', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'hotel_portfolio_marketing_init');

// Admin-Menü
function hotel_portfolio_marketing_add_admin_menu() {
    add_menu_page(
        __('Hotel Portfolio Marketing', 'hotel-portfolio-marketing'),
        __('Hotel Portfolio Marketing', 'hotel-portfolio-marketing'),
        'manage_options',
        'hotel-portfolio-marketing',
        'hotel_portfolio_marketing_admin_page',
        'dashicons-building',
        20
    );
}
add_action('admin_menu', 'hotel_portfolio_marketing_add_admin_menu');

// Admin-Seiteninhalt
function hotel_portfolio_marketing_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Hotel Portfolio Marketing Einstellungen', 'hotel-portfolio-marketing'); ?></h1>
        <p><?php esc_html_e('Hier kommen die Einstellungen und die Dokumentation.', 'hotel-portfolio-marketing'); ?></p>
        <a href="https://n8n.revo-h.com/form/c89fd1f7-89cb-464c-ab1a-8cb0cc74973d" class="button button-primary"><?php esc_html_e('Chronos Daten Sync', 'hotel-portfolio-marketing'); ?></a>
    </div>
    <?php
}

// AJAX-Handler für Hotel- und Marketingdaten
// AJAX-Handler für Hotel- und Marketingdaten mit DE/EN Umschaltung bei Offer-Titeln und -Beschreibungen
function hotel_portfolio_marketing_fetch_data() {
    global $wpdb;
    $lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : 'en';
    $target_group = isset($_GET['target_group']) ? sanitize_text_field($_GET['target_group']) : 'b2b';

    // Dynamisch die Offer-Titel- und Description-Felder je nach Sprache auswählen
    $offer_fields = [];
    for ($i = 1; $i <= 6; $i++) {
        $title_field = $lang === 'en' ? "m.offer_title_0{$i}_en" : "m.offer_title_0{$i}";
        $desc_field = $lang === 'en' ? "m.offer_description_0{$i}_en" : "m.offer_description_0{$i}";
        $offer_fields[] = "m.offer_type_0{$i}";
        $offer_fields[] = "$title_field AS offer_title_0{$i}";
        $offer_fields[] = "$desc_field AS offer_description_0{$i}";
        $offer_fields[] = "m.offer_image_0{$i}";
    }
    $offer_fields[] = "m.target_group";
    $offer_fields_sql = implode(",\n            ", $offer_fields);

    $results = $wpdb->get_results($wpdb->prepare("
        SELECT 
            h.image,
            h.name,
            COALESCE(ct.translation, h.country_code, 'Unknown') AS country, 
            h.zip,
            COALESCE(cty.translation, h.city, 'Unknown') AS city, 
            COALESCE(ctt.translation, COALESCE(h.county_town, ''), 'Unknown') AS county_town, 
            h.street,
            h.phone,
            h.email,
            h.homepage AS website,
            h.port_prio AS order_prio,
            COALESCE(h.brand, 'Unknown') AS brand, 
            COALESCE(h.parent_brand, 'Unknown') AS parent_brand, 
            h.publication_status,
            $offer_fields_sql
        FROM {$wpdb->prefix}hotel_portfolio_04 h
        LEFT JOIN {$wpdb->prefix}hotel_translation ct 
            ON ct.code = h.country_code AND ct.lang = %s AND ct.type = 'country'
        LEFT JOIN {$wpdb->prefix}hotel_translation cty 
            ON cty.code = h.city AND cty.lang = %s AND cty.type = 'city'
        LEFT JOIN {$wpdb->prefix}hotel_translation ctt 
            ON ctt.code = COALESCE(h.county_town, '') AND ctt.lang = %s AND ctt.type = 'county_town'
        LEFT JOIN {$wpdb->prefix}hotel_portfolio_marketing m
            ON h.name = m.hotel_name AND m.target_group = %s
        WHERE m.target_group = %s
        ORDER BY order_prio ASC, h.name ASC 
    ", $lang, $lang, $lang, $target_group, $target_group), ARRAY_A);

    if ($results) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error(__('Keine Daten gefunden.', 'hotel-portfolio-marketing'));
    }
}

add_action('wp_ajax_hotel_portfolio_marketing_fetch', 'hotel_portfolio_marketing_fetch_data');
add_action('wp_ajax_nopriv_hotel_portfolio_marketing_fetch', 'hotel_portfolio_marketing_fetch_data');



// Shortcodes geben NUR den Grid-Container aus
function hotel_portfolio_marketing_shortcode($atts) {
    $atts = shortcode_atts(array('target_group' => 'b2b'), $atts, 'hotel_portfolio_marketing');
    ob_start();
    $target_group = esc_attr($atts['target_group']);
    include HOTEL_PORTFOLIO_MARKETING_DIR . 'assets/portfolio-template-marketing.php';
    return ob_get_clean();
}
add_shortcode('hotel_portfolio_marketing', 'hotel_portfolio_marketing_shortcode');

add_shortcode('hotel_portfolio_marketing_b2b', function() {
    return hotel_portfolio_marketing_shortcode(array('target_group' => 'b2b'));
});
add_shortcode('hotel_portfolio_marketing_b2c', function() {
    return hotel_portfolio_marketing_shortcode(array('target_group' => 'b2c'));
});

// shortcode for b2b [hotel_portfolio_marketing_b2b]
// shortcode for b2c [hotel_portfolio_marketing_b2c]

// Scripte und Styles für Frontend einbinden
function hotel_portfolio_marketing_enqueue_scripts() {
    if (is_page(array('offers-b2b', 'offers-b2c'))) {

        // Haupt-Styles
        wp_enqueue_style(
            'hotel-portfolio-marketing-style',
            HOTEL_PORTFOLIO_MARKETING_URL . 'assets/portfolio-template-marketing.css',
            array(),
            HOTEL_PORTFOLIO_MARKETING_VERSION
        );

        // Haupt-Script mit AJAX-Daten
        wp_enqueue_script(
            'hotel-portfolio-marketing-ajax',
            HOTEL_PORTFOLIO_MARKETING_URL . 'assets/portfolio-template-marketing.js',
            array('jquery'),
            null,
            true
        );

        wp_localize_script('hotel-portfolio-marketing-ajax', 'hotelPortfolioMarketing', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'lang'    => get_locale(),
            'siteUrl' => get_site_url()
        ));

        // Optional: Filter-Funktionalitäten
        wp_enqueue_style(
            'hotel-portfolio-marketing-filter',
            HOTEL_PORTFOLIO_MARKETING_URL . 'assets/hotelfilter/filter-marketing.css',
            array(),
            HOTEL_PORTFOLIO_MARKETING_VERSION
        );

        wp_enqueue_script(
            'hotel-portfolio-marketing-filter',
            HOTEL_PORTFOLIO_MARKETING_URL . 'assets/hotelfilter/filter-marketing.js',
            array('jquery'),
            null,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'hotel_portfolio_marketing_enqueue_scripts');




