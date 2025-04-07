<?php
/**
 * Plugin Name: MICE Hotels
 * Plugin URI: https://hrg-hotels.com
 * Description: Ein Plugin zur Verwaltung von MICE Hotels.
 * Version: 1.0.0
 * Author: Stephan Leins
 * Author URI: https://hrg-hotels.com
 * License: GPL-2.0+
 * Text Domain: mice-hotels
 * Domain Path: /languages
 */

// Verhindere direkten Zugriff auf die Datei.
defined('ABSPATH') or exit;

/**
 * Konstanten definieren
 */
define('MICE_HOTELS_VERSION', '1.0.0');
define('MICE_HOTELS_DIR', plugin_dir_path(__FILE__));
define('MICE_HOTELS_URL', plugin_dir_url(__FILE__));

/**
 * Plugin-Deaktivierung.
 */
function mice_hotels_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'mice_hotels_deactivate');

/**
 * Plugin-Initialisierung: Übersetzungen laden.
 */
function mice_hotels_init() {
    load_plugin_textdomain('mice-hotels', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'mice_hotels_init');

/**
 * Admin-Menü hinzufügen.
 */
function mice_hotels_add_admin_menu() {
    add_menu_page(
        __('MICE Hotels', 'mice-hotels'),
        __('MICE Hotels', 'mice-hotels'),
        'manage_options',
        'mice-hotels',
        'mice_hotels_admin_page',
        'dashicons-building',
        20
    );
}
add_action('admin_menu', 'mice_hotels_add_admin_menu');

/**
 * Admin-Seiteninhalt.
 */
function mice_hotels_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('MICE Hotels Einstellungen', 'mice-hotels'); ?></h1>
        <p><?php esc_html_e('Hier kommen die Einstellungen und die Dokumentation', 'mice-hotels'); ?></p>
    </div>
    <?php
}

/**
 * Sicherer AJAX-Handler zum Abrufen der Hotel-Daten.
 */
function mice_hotels_fetch_data() {
    global $wpdb;
    $lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : 'en';

    $query = "
    SELECT 
        h.image,
        h.name,
        h.mice_image,
        COALESCE(ct.translation, h.country_code, 'Unknown') AS country, 
        h.zip,
        COALESCE(cty.translation, h.city, 'Unknown') AS city, 
        h.street,
        h.phone,
        h.email,
        h.homepage AS website,
        h.mice_prio AS order_prio,
        COALESCE(h.brand, 'Unknown') AS brand, 
        COALESCE(h.parent_brand, 'Unknown') AS parent_brand, 
        h.publication_status,
        h.mice_request,
        h.total_conference_space_in_m AS area,
        h.max_number_of_participants_total AS people
    FROM {$wpdb->prefix}hotel_portfolio_04 h
    LEFT JOIN {$wpdb->prefix}hotel_translation ct 
        ON ct.code = h.country_code AND ct.lang = %s AND ct.type = 'country'
    LEFT JOIN {$wpdb->prefix}hotel_translation cty 
        ON cty.code = h.city AND cty.lang = %s AND cty.type = 'city'
    WHERE h.mice_request = 'True'
    ORDER BY order_prio ASC, h.name ASC
";


    $results = $wpdb->get_results($wpdb->prepare($query, $lang, $lang), ARRAY_A);

    foreach ($results as &$hotel) {
        // Falls `mice_image` existiert und nicht leer ist, ersetze `image`
        if (!empty($hotel['mice_image'])) {
            $hotel['image'] = $hotel['mice_image'];
        }
    }

    if ($results) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error(__('Keine Daten gefunden.', 'mice-hotels'));
    }
}



add_action('wp_ajax_mice_hotels_fetch', 'mice_hotels_fetch_data');
add_action('wp_ajax_nopriv_mice_hotels_fetch', 'mice_hotels_fetch_data');

/**
 * JavaScript und Styles sicher einbinden.
 */
function mice_hotels_enqueue_scripts() {
    if (is_page(array('meetings-und-events','meetings-events'))) {

        // Debugging: Prüfe generierte URLs
        error_log('MICE HOTELS CSS URL: ' . plugins_url('assets/mice-hotels-template.css', __FILE__));
        error_log('MICE FILTER CSS URL: ' . plugins_url('assets/micefilter/mice-filter.css', __FILE__));

        // CSS für das Hauptlayout
        wp_enqueue_style(
            'mice-hotels-style', 
            plugins_url('assets/mice-hotels-template.css', __FILE__), 
            array(), 
            MICE_HOTELS_VERSION
        );

        // CSS für den Filterbereich
        wp_enqueue_style(
            'mice-hotels-filter', 
            plugins_url('assets/micefilter/mice-filter.css', __FILE__), 
            array(), 
            MICE_HOTELS_VERSION
        );

        // JavaScript für das Hauptlayout
        wp_enqueue_script(
            'mice-hotels-ajax',
            plugins_url('assets/mice-hotels-template.js', __FILE__),
            array('jquery'),
            MICE_HOTELS_VERSION,
            true
        );

        // **Hier wird `miceHotels` als globales Objekt an JavaScript übergeben**
        wp_localize_script('mice-hotels-ajax', 'miceHotels', array(
            'ajaxurl' => admin_url('admin-ajax.php')
        ));

        // JavaScript für den Filterbereich
        wp_enqueue_script(
            'mice-hotels-filter', 
            plugins_url('assets/micefilter/mice-filter.js', __FILE__), 
            array('jquery'), 
            MICE_HOTELS_VERSION, 
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'mice_hotels_enqueue_scripts');

/**
 * Shortcode für die Hotel-Grid-Anzeige mit Template-Einbindung.
 */
function mice_hotels_display_grid() {
    ob_start();

    // Prüfen, ob die Datei existiert, bevor sie eingebunden wird
    $template_path = MICE_HOTELS_DIR . 'assets/mice-hotels-template.php';

    if (file_exists($template_path)) {
        include $template_path;
    } else {
        error_log('MICE HOTELS: Template-Datei nicht gefunden: ' . $template_path);
        echo '<p style="color: red;">Fehler: Template-Datei nicht gefunden!</p>';
    }

    return ob_get_clean();
}
add_shortcode('mice_hotels', 'mice_hotels_display_grid');


