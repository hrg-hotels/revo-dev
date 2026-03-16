<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');

// Standardmäßig Deutsch setzen
// $lang = 'de_DE';
// if (strpos($_SERVER['REQUEST_URI'], '-en/') !== false) {
//     $lang = 'en_US';
// }

// WordPress dazu zwingen, die Sprache zu wechseln
switch_to_locale($lang);

?>
<script>
    var hotelFilterTranslations = {
        country: "<?php echo esc_js(ucfirst(__('country', 'hotel-portfolio'))); ?>",
        city: "<?php echo esc_js(ucfirst(__('city', 'hotel-portfolio'))); ?>",
        brand: "<?php echo esc_js(ucfirst(__('brand', 'hotel-portfolio'))); ?>",
        category: "<?php echo esc_js(ucfirst(__('category', 'hotel-portfolio'))); ?>",
        noResult: "<?php echo esc_js(ucfirst(__('no-result', 'hotel-portfolio'))); ?>",
        searchResultet: "<?php echo esc_js(ucfirst(__('search-resultet', 'hotel-portfolio'))); ?>",
        hits: "<?php echo esc_js(ucfirst(__('hits', 'hotel-portfolio'))); ?>",
        yourSelection: "<?php echo esc_js(ucfirst(__('your-selection', 'hotel-portfolio'))); ?>"
    };
</script>

<div id="scroll-link" class="search-wrapper">
  <div class="row-search">
        <!-- Country Dropdown -->
        <div class="selection-hr">
            <div class="select-jobtitle" id="jobtitle-select">
                <div class="select-header">
                <input name="jobtitle" type="text" id="jobtitle-header" placeholder="jobtitle" />
                </div>
                <ul class="select-options" id="jobtitle-options"></ul>
            </div>
        </div>

        <!-- City Dropdown -->
        <div class="selection-hr">
            <div class="select-city" id="city-select">
                <div class="select-header">
                    <input name="city" type="text" id="city-header" placeholder="<?php echo ucfirst(esc_html__('city', 'hotel-portfolio'))?>" />
                </div>
                <ul class="select-options" id="city-options"></ul>
            </div>
        </div>
        <!-- Brand Dropdown -->
        <div class="selection-hr">
            <div class="select-brand" id="brand-select">
                <div class="select-header">
                    <input name="brand" type="text" id="brand-header" placeholder="<?php echo ucfirst(esc_html__('brand', 'hotel-portfolio'))?>"/>
                </div>
                <ul class="select-options" id="brand-options"></ul>
            </div>
        </div>	
        <!-- Parent Brand Dropdown -->
        <div class="selection-hr last-selection">
            <div class="select-department" id="department-select">
                <div class="select-header">
                    <input name="department" type="text" id="department-header" placeholder="department"/>
                </div>
                <ul class="select-options" id="department-options"></ul>
            </div>
        </div>	

        <!-- Buttons -->
        <div class="btn-wrapper">
            <div id="btn-reset">
              <img src="<?php echo esc_url(plugins_url('../img/restart_alt.svg', __FILE__)); ?>" alt="reset" />
               <div><span style="color:#181B20;"> Reset</span></div>
            </div>
        </div>
  </div>
  <div id="message-wrapper"></div>
</div>
