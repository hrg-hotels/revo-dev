<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');

?>
<script>
    var hotelFilterTranslations = {
        country: "<?php echo esc_js(ucfirst(__('country', 'hotel-portfolio'))); ?>",
        city: "<?php echo esc_js(ucfirst(__('city', 'hotel-portfolio'))); ?>",
        brand: "<?php echo esc_js(ucfirst(__('brand', 'hotel-portfolio'))); ?>",
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
            <div class="select-country" id="country-select">
                <div class="select-header">
                <input name="country" type="text" autocomplete="off" maxlength="30" id="country-header" placeholder="<?php echo ucfirst(esc_html__('country', 'hotel-portfolio')) ?>" />
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
                    <input name="parent-brand" type="text" autocomplete="off" maxlength="50" id="parent-brand-header" placeholder="Franchise Partner"/>
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

        <!-- MICE/All Hotels/Restaurants/some other objects Dropdown -->
        <div class="selection-hr">
            <div class="select-object-type" id="object-type-select">
                <div class="select-header">
                    <input name="object-type" type="text" autocomplete="off" id="object-type-header" maxlength="20" placeholder="All hotels"/>
                </div>
                <ul class="select-options" id="object-type-options"></ul>
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

<div id="revo-hotels-map" style="width: 100%; height: 500px; margin-top: 20px;"></div>
