<?php

header('Content-Type: application/javascript');

// Sicherstellen, dass WP geladen ist:
// if ( ! defined('ABSPATH') ) {
//     // Nur aufrufen, wenn über WP
//     exit;
// }

// Option 1: Direkter Zugriff im Frontend
// Option 2: Übersetzungs-Array dynamisch generieren

$translations = array(
    'country'         => ucfirst(__('country', 'hotel-portfolio')),
    'city'            => ucfirst(__('city', 'hotel-portfolio')),
    'brand'           => ucfirst(__('brand', 'hotel-portfolio')),
    'category'        => ucfirst(__('category', 'hotel-portfolio')),
    'noResult'        => ucfirst(__('no-result', 'hotel-portfolio')),
    'searchResultet'  => ucfirst(__('search-resultet', 'hotel-portfolio')),
    'hits'            => ucfirst(__('hits', 'hotel-portfolio')),
    'yourSelection'   => ucfirst(__('your-selection', 'hotel-portfolio')),
    // ... weitere Keys ...
);
?>
window.hotelFilterTranslations = <?php echo json_encode($translations, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
