<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');
include_once HOTEL_PORTFOLIO_MARKETING_DIR . 'assets/hotelfilter/filter-marketing.php';
?>


<div id="hotel-portfolio-container" data-target-group="<?php echo esc_attr($target_group); ?>">
    <p>⏳ Hotels werden geladen...</p>
</div>
<div id="message-wrapper" style="position:relative;"></div>
<div class="portfolio-pagination">
    <div class="arrow-pag pleft">
    <img 
        src="<?php echo esc_url(plugins_url('/img/arrow_pag.svg', __FILE__)); ?>" 
        alt="arrow" 
        class="pag pag-left"
    />

      <div id="prev-page" class="pag-item"></div>
    </div>

    <div id="current-page" class="pag-item pag-center"></div>

    <div class="arrow-pag pright">
    <div id="next-page" class="pag-item"></div>
    <img 
        src="<?php echo esc_url(plugins_url('/img/arrow_pag.svg', __FILE__)); ?>" 
        alt="arrow" 
        class="pag pag-right"
    />

    </div>
  </div>
  <!--Image path for the JavaScript file -->
  <script>
    let imgPath = "<?php echo esc_url(plugins_url('/img/', __FILE__)); ?>";
        var hotelFilterTranslations = {
        country: "<?php echo esc_js(ucfirst(__('country', 'hotel-portfolio'))); ?>",
        city: "<?php echo esc_js(ucfirst(__('city', 'hotel-portfolio'))); ?>",
        brand: "<?php echo esc_js(ucfirst(__('brand', 'hotel-portfolio'))); ?>",
        noResult: "<?php echo esc_js(ucfirst(__('noResult', 'hotel-portfolio'))); ?>",
        searchResultet: "<?php echo esc_js(ucfirst(__('searchResultet', 'hotel-portfolio'))); ?>",
        hits: "<?php echo esc_js(ucfirst(__('hits', 'hotel-portfolio'))); ?>",
        yourSelection: "<?php echo esc_js(ucfirst(__('yourSelection', 'hotel-portfolio'))); ?>",
        consentText: "<?php echo esc_js(ucfirst(__('consentText', 'hotel-portfolio'))); ?>",
        consentHeadline: "<?php echo esc_js(ucfirst(__('consentHeadline', 'hotel-portfolio'))); ?>",
        showMap: "<?php echo esc_js(ucfirst(__('showMap', 'hotel-portfolio'))); ?>",
        noHotelsFound: "<?php echo esc_js(ucfirst(__('noHotelsFound', 'hotel-portfolio'))); ?>",
        noResultsFound: "<?php echo esc_js(ucfirst(__('noResultsFound', 'hotel-portfolio'))); ?>",
        discoverMore: "<?php echo esc_js(ucfirst(__('discover-more', 'hotel-portfolio'))); ?>",
        conferenceSpace: "<?php echo esc_js(ucfirst(__('conference-space', 'hotel-portfolio'))); ?>",
        numberOfParticipants: "<?php echo esc_js(ucfirst(__('number-of-participants', 'hotel-portfolio'))); ?>",
        offer: "<?php echo esc_js(ucfirst(__('offer', 'hotel-portfolio'))); ?>"

    };
    console.log("Hotel Filter Translations Loaded", hotelFilterTranslations);
</script>




