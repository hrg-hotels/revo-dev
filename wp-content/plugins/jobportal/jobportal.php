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

defined('ABSPATH') or exit;

/**
 * Konstanten
 */
define('JOBPORTAL_VERSION', '1.0.0');
define('JOBPORTAL_DIR', plugin_dir_path(__FILE__));
define('JOBPORTAL_URL', plugin_dir_url(__FILE__));

/**
 * Deaktivierung
 */
function jobportal_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'jobportal_deactivate');

/**
 * Init: Textdomain laden
 */
function jobportal_init() {
    load_plugin_textdomain('jobportal', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('init', 'jobportal_init');

/**
 * Admin-Menü
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
 * Admin-Seite
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
 * Helper: I18n-Map laden (aus ausgelagerter Datei) und um dynamische Werte ergänzen
 */
function jobportal_get_i18n_map() {
    $map = [];

    // Optional: ausgelagerte Liste mit vielen Keys
    $map_file = JOBPORTAL_DIR . 'includes/i18n-map.php';
    if (file_exists($map_file)) {
        // i18n-map.php muss ein Array zurückgeben
        $loaded = include $map_file;
        if (is_array($loaded)) {
            $map = $loaded;
        }
    }

    // Fallback/Minimalwerte (nur als Beispiel — die meisten Keys sollten in i18n-map.php gepflegt werden)
    $map = array_merge(
        [
            'country'       => ucfirst(__('country', 'jobportal')),
            'city'          => ucfirst(__('city', 'jobportal')),
            'brand'         => ucfirst(__('brand', 'jobportal')),
            'category'      => ucfirst(__('category', 'jobportal')),
            'noResult'      => ucfirst(__('no-result', 'jobportal')),
            'searchResult'  => ucfirst(__('search-resultet', 'jobportal')),
            'hits'          => ucfirst(__('hits', 'jobportal')),
            'yourSelection' => ucfirst(__('your-selection', 'jobportal')),
        ],
        $map
    );

    // Laufzeit-Pfade/URLs ergänzen
    $map['imgPath'] = esc_url(JOBPORTAL_URL . 'assets/img/');

    return $map;
}

/**
 * AJAX-Handler
 */
function jobportal_fetch_data() {
    global $wpdb;

    $lang = isset($_GET['lang']) ? sanitize_text_field($_GET['lang']) : 'de';

   $sql = "
        SELECT 
            TRIM(h.reference_id) AS reference_id, 
            TRIM(h.channel) AS channel, 
            TRIM(h.title) AS title, 
            TRIM(h.tasks) AS tasks, 
            TRIM(h.description) AS description,
            TRIM(h.requirement_content) AS requirement_content, 
            TRIM(h.offer) AS offer, 
            TRIM(COALESCE(ct.translation, h.location_countrycode, 'Unknown')) AS country, 
            TRIM(h.language) AS language, 
            TRIM(COALESCE(cty.translation, h.location_city, 'Unknown')) AS city,
            TRIM(h.location_postalcode) AS location_postalcode, 
            TRIM(h.location_streetname) AS location_streetname, 
            TRIM(h.location_buildingnumber) AS location_buildingnumber, 
            TRIM(h.joblocation_type) AS joblocation_type, 
            TRIM(h.keywords) AS keywords, 
            TRIM(h.apply_url) AS apply_url, 
            TRIM(h.images_header0) AS images_header0, 
            TRIM(h.images_header1) AS images_header1, 
            TRIM(h.images_header2) AS images_header2, 
            TRIM(h.images_backgroundimage) AS images_backgroundimage, 
            TRIM(h.video) AS video, 
            TRIM(h.companyname) AS companyname, 
            TRIM(COALESCE(h.companyname, 'Unknown')) AS brand, 
            TRIM(h.employment_type) AS employment_type, 
            TRIM(h.recruiter_position) AS recruiter_position, 
            TRIM(h.recruiter_firstname) AS recruiter_firstname, 
            TRIM(h.recruiter_phone) AS recruiter_phone, 
            TRIM(h.careerlevels) AS careerlevels, 
            TRIM(h.categories) AS categories, 
            TRIM(COALESCE(h.seo_category, 'Unknown')) AS department,
       h.published_at,
        DATE_FORMAT(h.published_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ') AS published_iso
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
 * Assets einbinden
 */
function jobportal_enqueue_scripts() {
    if (is_page(array('jobs', 'jobportal'))) {
        // CSS
        $css_path = JOBPORTAL_DIR . 'assets/css/dist/jobportal.css';
        wp_enqueue_style(
            'jobportal-style',
            JOBPORTAL_URL . 'assets/css/dist/jobportal.css',
            [],
            file_exists($css_path) ? filemtime($css_path) : JOBPORTAL_VERSION
        );

        // jQuery (WP liefert es; in Webpack als external konfiguriert)
        wp_enqueue_script('jquery');

        // 1) I18n & Pfade als Inline-JS vor dem Bundle (ohne Extra-Request)
        $i18n = jobportal_get_i18n_map();

        // Leeres Script registrieren, damit wir Inline-JS sauber injizieren können
        wp_register_script('jobportal-i18n', '', [], JOBPORTAL_VERSION, true);
        wp_add_inline_script('jobportal-i18n', 'window.jobportalTranslations = ' . wp_json_encode($i18n, JSON_UNESCAPED_UNICODE) . ';', 'before');
        wp_enqueue_script('jobportal-i18n');

        // 2) Hauptbundle
        $js_path = JOBPORTAL_DIR . 'assets/js/dist/jobportal.bundle.js';
        wp_enqueue_script(
            'jobportal-bundle',
            JOBPORTAL_URL . 'assets/js/dist/jobportal.bundle.js',
            ['jquery', 'jobportal-i18n'], // i18n muss vorher da sein
            file_exists($js_path) ? filemtime($js_path) : JOBPORTAL_VERSION,
            true
        );

        // 3) ajaxurl vor dem Bundle verfügbar machen (falls du es brauchst)
        wp_add_inline_script(
            'jobportal-bundle',
            'window.jobPortal = { ajaxurl: ' . wp_json_encode(admin_url('admin-ajax.php')) . ' };',
            'before'
        );
    }
}
add_action('wp_enqueue_scripts', 'jobportal_enqueue_scripts');


/**
 * Shortcode
 */
function jobportal_display_grid() {
    ob_start();
    include JOBPORTAL_DIR . '/jobportal-template.php';
    return ob_get_clean();
}
add_shortcode('jobportal', 'jobportal_display_grid');
