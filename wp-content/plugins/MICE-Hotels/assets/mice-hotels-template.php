<?php
defined('ABSPATH') or die('No script kiddies please!');
include MICE_HOTELS_DIR . 'assets/micefilter/mice-filter.php';
?>
<div id="hotel-portfolio-container">
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
    let imgUpl = "<?php echo esc_url(wp_upload_dir()['baseurl']); ?>";
</script>





