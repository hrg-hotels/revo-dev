<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');
include JOBPORTAL_DIR . 'jobfilter.php';
include JOBPORTAL_DIR . 'extended-filter.php'; 
?>

<div id="jobportal-container">
  <div style="width:100%; text-align:center;">
    <p>⏳ Jobs loading.....</p>
  </div>
</div>

<div id="message-wrapper" style="position:relative;"></div>

<div class="portfolio-pagination" style="display:none;">
  <div class="arrow-pag pleft">
    <img 
      src="<?php echo esc_url(plugins_url('assets/img/arrow_pag.svg', __FILE__)); ?>" 
      alt="arrow" 
      class="pag pag-left"
    />
    <div id="prev-page" class="pag-item"></div>
  </div>

  <div id="current-page" class="pag-item pag-center"></div>

  <div class="arrow-pag pright">
    <div id="next-page" class="pag-item"></div>
    <img 
      src="<?php echo esc_url(plugins_url('assets/img/arrow_pag.svg', __FILE__)); ?>" 
      alt="arrow" 
      class="pag pag-right"
    />
  </div>
</div>


  <!--Image path for the JavaScript file -->
<script>
  let imgPath = "<?php echo esc_url(plugins_url('assets/img/', __FILE__)); ?>";
  console.log(imgPath);
</script>




