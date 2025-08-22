<?php
/**
 * Plugin Name: Jobportal
 * Plugin URI: https://hrg-hotels.com
 * Description: Ein Plugin zur Verwaltung von Jobangeboten.
 * Version: 1.0.0
 * Author: Stephan Leins
 * License: GPL-2.0+
 * Text Domain: jobportal
 * Domain Path: /languages
 */

// Verhindere direkten Zugriff auf die Datei.
defined('ABSPATH') or exit;

/**
 * Konstanten definieren
 */
define('JOBPORTAL_VERSION', '1.0.0');
define('JOBPORTAL_DIR', plugin_dir_path(__FILE__));
define('JOBPORTAL_URL', plugin_dir_url(__FILE__));

/**
 * Plugin-Deaktivierung.
 */
function jobportal_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'jobportal_deactivate');

/**
 * Plugin-Initialisierung: Übersetzungen laden.
 */
function jobportal_init() {
    load_plugin_textdomain('jobportal', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'jobportal_init');

/**
 * Admin-Menü hinzufügen.
 */
function jobportal_add_admin_menu() {
    add_menu_page(
        __('Jobportal', 'jobportal'),
        __('Jobportal', 'jobportal'),
        'manage_options',
        'jobportal',
        'jobportal_admin_page',
        'dashicons-businessman',
        20
    );
}
add_action('admin_menu', 'jobportal_add_admin_menu');

/**
 * Admin-Seiteninhalt.
 */
function jobportal_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Jobportal Einstellungen', 'jobportal'); ?></h1>
        <p><?php esc_html_e('Hier kommen die Einstellungen und die Dokumentation', 'jobportal'); ?></p>
    </div>
    <?php
}

/**
 * Sicherer AJAX-Handler zum Abrufen der Job-Daten.
 */
function jobportal_fetch_data() {
    global $wpdb;

    $lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : 'de';

    $sql = "
        SELECT 
            h.reference_id, 
            h.channel, 
            h.title, 
            h.tasks, 
            h.requirement_content, 
            h.offer, 
            COALESCE(ct.translation, h.location_countrycode, 'Unknown') AS country, 
            h.language, 
            COALESCE(cty.translation, h.location_city, 'Unknown') AS city,
            h.location_postalcode, 
            h.location_streetname, 
            h.location_buildingnumber, 
            h.joblocation_type, 
            h.keywords, 
            h.apply_url, 
            h.images_header0, 
            h.images_header1, 
            h.images_header2, 
            h.images_backgroundimage, 
            h.video, 
            h.companyname, 
            COALESCE(h.companyname, 'Unknown') AS brand, 
            h.employment_type, 
            h.recruiter_position, 
            h.recruiter_firstname, 
            h.recruiter_phone, 
            h.careerlevels, 
            h.categories, 
            COALESCE(h.seo_category, 'Unknown') AS department,
            h.published_at 
        FROM {$wpdb->prefix}jobportal h
        LEFT JOIN {$wpdb->prefix}hotel_translation ct 
            ON ct.code = h.location_countrycode AND ct.lang = %s AND ct.type = 'country'
        LEFT JOIN {$wpdb->prefix}hotel_translation cty 
            ON cty.code = h.location_city AND cty.lang = %s AND cty.type = 'city'
    ";

    $prepared_sql = $wpdb->prepare($sql, $lang, $lang);
    $results = $wpdb->get_results($prepared_sql, ARRAY_A);

    if ($results) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error(__('Keine Daten gefunden.', 'jobportal'));
    }
}
add_action('wp_ajax_jobportal_fetch', 'jobportal_fetch_data');
add_action('wp_ajax_nopriv_jobportal_fetch', 'jobportal_fetch_data');


/**
 * JavaScript und Styles sicher einbinden.
 */
function jobportal_enqueue_scripts() {
    if (is_page(array('jobs', 'jobportal'))) {

        // CSS
        wp_enqueue_style(
            'jobportal-style',
            JOBPORTAL_URL . 'assets/jobportal-template.css',
            array(),
            JOBPORTAL_VERSION
        );

        // jQuery (WP liefert es; in Webpack als external konfiguriert)
        wp_enqueue_script('jquery');

        // NEU: das Webpack-Bundle laden (statt der alten jobportal-template.js)
        wp_enqueue_script(
        'jobportal-bundle',
        JOBPORTAL_URL . 'assets/js/dist/jobportal.bundle.js',
        array('jquery'),
        filemtime(JOBPORTAL_DIR . 'assets/js/dist/jobportal.bundle.js'),
        true
        );

        // Globals (Ajax-URL etc.) an das Bundle übergeben
        wp_localize_script('jobportal-bundle', 'jobPortal', array(
            'ajaxurl' => admin_url('admin-ajax.php')
        ));

        // Wichtig: KEIN type="module" mehr setzen – Webpack erzeugt reguläres Bundle.
    }
}
add_action('wp_enqueue_scripts', 'jobportal_enqueue_scripts');


/**
 * Shortcode für die Job-Grid-Anzeige mit Template-Einbindung.
 */
function jobportal_display_grid() {
    ob_start();
    include JOBPORTAL_DIR . '/jobportal-template.php';
    return ob_get_clean();
}
add_shortcode('jobportal', 'jobportal_display_grid');
