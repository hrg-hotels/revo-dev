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

    $results = $wpdb->get_results("SELECT 
        reference_id, channel, title, tasks, requirement_content, offer, 
        location_countrycode, language, location_city, location_postalcode, location_streetname, location_buildingnumber, 
        joblocation_type, keywords, apply_url, images_header0, images_header1, images_header2, 
        images_backgroundimage, video, companyname, employment_type, recruiter_position, recruiter_firstname, 
        recruiter_phone, careerlevels, categories, seo_category, published_at 
        FROM {$wpdb->prefix}jobportal", ARRAY_A);

    if ($results) {
        wp_send_json_success(["jobListDB" => $results]);
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
        wp_enqueue_style('jobportal-style', JOBPORTAL_URL . 'assets/jobportal-template.css', array(), JOBPORTAL_VERSION);
        wp_enqueue_script('jobportal-ajax', JOBPORTAL_URL . 'assets/jobportal-template.js', array('jquery'), null, true);
        
        wp_localize_script('jobportal-ajax', 'jobPortal', array(
            'ajaxurl' => admin_url('admin-ajax.php')
        ));
        wp_enqueue_style('hotel-portfolio-filter', JOBPORTAL_URL .  'assets/jobfilter/jobfilter.css', array(), JOBPORTAL_VERSION);
        wp_enqueue_script('hotel-portfolio-filter', JOBPORTAL_URL .  'assets/jobfilter/jobfilter.js', array('jquery'), null, true);
    }
}
add_action('wp_enqueue_scripts', 'jobportal_enqueue_scripts');

/**
 * Shortcode für die Job-Grid-Anzeige mit Template-Einbindung.
 */
function jobportal_display_grid() {
    ob_start();
    include JOBPORTAL_DIR . 'assets/jobportal-template.php';
    return ob_get_clean();
}
add_shortcode('jobportal', 'jobportal_display_grid');
