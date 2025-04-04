<?php
// Direkten Zugriff verhindern
defined('ABSPATH') or die('No script kiddies please!');

/**
 * Admin-Menü für CSV-Import erstellen
 */
function hotel_portfolio_admin_menu() {
    // Unterpunkt: CSV-Import
    add_submenu_page(
        'hotel-portfolio',        // Slug des Hauptmenüs
        'CSV-Import',             // Titel der Unterseite
        'CSV-Import',             // Name des Menüeintrags
        'manage_options',         // Berechtigung
        'hotel-portfolio-import', // Slug für den Importer
        'hotel_portfolio_import_page' // Funktion für die Import-Seite
    );
}
add_action('admin_menu', 'hotel_portfolio_admin_menu');

/**
 * HTML für die Import-Seite
 */
function hotel_portfolio_import_page() {
    ?>
    <div class="wrap">
        <h1>CSV-Import für Hotels</h1>
        <form method="post" enctype="multipart/form-data">
            <input type="file" name="hotel_csv_file" accept=".csv">
            <button type="submit" name="hotel_csv_import" class="button button-primary">Import starten</button>
        </form>
    </div>
    <?php

    if (isset($_POST['hotel_csv_import']) && !empty($_FILES['hotel_csv_file']['tmp_name'])) {
        $csv_file = $_FILES['hotel_csv_file']['tmp_name'];
        hotel_portfolio_import_csv_manual($csv_file);
        echo '<p style="color:green;">CSV-Import erfolgreich!</p>';
    }
}

/**
 * CSV-Datei verarbeiten und in die Datenbank speichern
 */
function hotel_portfolio_import_csv_manual($csv_file) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'hotel_portfolio';

    if (!file_exists($csv_file)) {
        return;
    }

    $file = fopen($csv_file, 'r');
    if (!$file) {
        return;
    }

    // Bestehende Daten löschen
    $wpdb->query("TRUNCATE TABLE $table_name");

    // Erste Zeile ignorieren (Header)
    fgetcsv($file);

    while (($data = fgetcsv($file, 1000, ',')) !== FALSE) {
        $wpdb->insert(
            $table_name,
            array(
                'chronos_id' => sanitize_text_field($data[0]),
                'publication_status' => sanitize_text_field($data[1]),
                'country' => sanitize_text_field($data[2]),
                'zip' => sanitize_text_field($data[3]),
                'city' => sanitize_text_field($data[4]),
                'mice_request' => sanitize_text_field($data[5]),
                'hotel_id' => sanitize_text_field($data[6]),
                'name' => sanitize_text_field($data[8]),
                'street' => sanitize_text_field($data[19]),
                'email' => sanitize_email($data[20]),
                'phone' => sanitize_text_field($data[21]),
                'website' => esc_url_raw($data[22]),
                'lat' => floatval($data[25]),
                'lon' => floatval($data[26]),
                'rooms' => intval($data[27]),
                'total_conference_space_in_m' => intval($data[28]),
                'max_number_of_participants_total' => intval($data[29]),
            )
        );
    }
    fclose($file);
}
?>
