<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');

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
        yourSelection: "<?php echo esc_js(ucfirst(__('your-selection', 'hotel-portfolio'))); ?>",
        people: "<?php echo esc_js(ucfirst(__('people', 'hotel-portfolio'))); ?>",
        area: "<?php echo esc_js(ucfirst(__('area', 'hotel-portfolio'))); ?>",
    };
</script>

<div id="scroll-link" class="search-wrapper">
  <div class="row-search">
        <!-- Country Dropdown -->
        <div class="selection-hr">
            <div class="select-country" id="country-select">
                <div class="select-header">
                <input name="country" type="text" autocomplete="off" id="country-header" maxlength="30" placeholder="<?php echo ucfirst(esc_html__('country', 'hotel-portfolio')) ?>" />
                </div>
                <ul class="select-options" id="country-options"></ul>
            </div>
        </div>

        <!-- City Dropdown -->
        <div class="selection-hr">
            <div class="select-city" id="city-select">
                <div class="select-header">
                    <input name="city" type="text" autocomplete="off" id="city-header" maxlength="50" placeholder="<?php echo ucfirst(esc_html__('city', 'hotel-portfolio'))?>" />
                </div>
                <ul class="select-options" id="city-options"></ul>
            </div>
        </div>

        <!-- Parent Brand Dropdown -->
        <div class="selection-hr last-selection">
            <div class="select-parent-brand" id="parent-brand-select">
                <div class="select-header">
                    <input name="parent-brand" type="text" autocomplete="off" id="parent-brand-header" maxlength="50" placeholder="Franchise Partner"/>
                </div>
                <ul class="select-options" id="parent-brand-options"></ul>
            </div>
        </div>	

        <!-- Brand Dropdown -->
        <div class="selection-hr">
            <div class="select-brand" id="brand-select">
                <div class="select-header">
                    <input name="brand" type="text" autocomplete="off" id="brand-header" maxlength="50" placeholder="<?php echo ucfirst(esc_html__('brand', 'hotel-portfolio'))?>"/>
                </div>
                <ul class="select-options" id="brand-options"></ul>
            </div>
        </div>	
          <!-- Area Dropdown -->
          <div class="selection-hr">
            <div class="select-area" id="area-select">
                <div class="select-header">
                    <input name="area" type="text" class="read-only" autocomplete="off" id="area-header" maxlength="50" placeholder="<?php echo esc_js(ucfirst(__('area', 'hotel-portfolio')))?>" readonly/>
                </div>
                <ul class="select-options" id="area-options"></ul>
            </div>
        </div>	

        <!-- People Dropdown -->
        <div class="selection-hr">
            <div class="select-people" id="people-select">
                <div class="select-header">
                    <input name="people" class="read-only" autocomplete="off" type="text" id="people-header" placeholder="<?php echo esc_js(ucfirst(__('people', 'hotel-portfolio')))?>" readonly/>
                </div>
                <ul class="select-options" id="people-options"></ul>
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
