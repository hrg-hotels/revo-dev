<?php
// Keine Output-Header, das ist ein PHP-Include für HTML, kein JS-File!
$translations = array(
    'country'         => ucfirst(__('country', 'revo-plugin-translations')),
    'city'            => ucfirst(__('city', 'revo-plugin-translations')),
    'brand'           => ucfirst(__('brand', 'revo-plugin-translations')),
    'category'        => ucfirst(__('category', 'revo-plugin-translations')),
    'noResult'        => ucfirst(__('no-result', 'revo-plugin-translations')),
    'searchResultet'  => ucfirst(__('search-resultet', 'revo-plugin-translations')),
    'hits'            => ucfirst(__('hits', 'revo-plugin-translations')),
    'yourSelection'   => ucfirst(__('your-selection', 'revo-plugin-translations')),
    // ... weitere Keys ...
);
?>
<script>
window.hotelFilterTranslations = <?php echo json_encode($translations, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
</script>
