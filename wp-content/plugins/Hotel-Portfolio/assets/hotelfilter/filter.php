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
        yourSelection: "<?php echo esc_js(ucfirst(__('your-selection', 'hotel-portfolio'))); ?>"
    };
</script>

<div id="scroll-link" class="search-wrapper">
      <div class="btn-wrapper-view">
            <div class="btn-view-container">
            <a id="grid-view-btn" class="btn btn-view active-view" href="#" role="button" aria-label="Switch to grid view">
                <img class="view-icon" src="<?php echo esc_url(content_url('revo-shared-files/img/list_alt_active.svg')); ?>" alt="Map view icon" /> 
                <?php echo ucfirst(esc_html__('grid-view', 'hotel-portfolio')) ?>
            </a>
            </div> 
            <div class="btn-view-container">
            <a id="map-view-btn" class="btn btn-view" href="#" role="button" aria-label="Switch to map view">
                <img class="view-icon" src="<?php echo esc_url(content_url('revo-shared-files/img/map.svg')); ?>" alt="Grid view icon" /> 
                <?php echo ucfirst(esc_html__('map-view', 'hotel-portfolio')) ?>
            </a>
            </div>
        </div>
  <div class="row-search">

        <!-- Country Dropdown -->
        <div class="selection-hr">
            <div class="select-country" id="country-select">
                <label for="country-header" class="visually-hidden"><?php echo ucfirst(esc_html__('country', 'hotel-portfolio')) ?></label>
                <div class="select-header">
                    <input 
                        name="country"
                        type="text"
                        autocomplete="off"
                        maxlength="30"
                        id="country-header"
                        placeholder="<?php echo ucfirst(esc_html__('country', 'hotel-portfolio')) ?>"
                        aria-label="<?php echo ucfirst(esc_html__('country', 'hotel-portfolio')) ?>"
                    />
                </div>
                <ul class="select-options" id="country-options"></ul>
            </div>
        </div>

        <!-- City Dropdown -->
        <div class="selection-hr">
            <div class="select-city" id="city-select">
                <label for="city-header" class="visually-hidden"><?php echo ucfirst(esc_html__('city', 'hotel-portfolio')) ?></label>
                <div class="select-header">
                    <input 
                        name="city"
                        type="text"
                        autocomplete="off"
                        maxlength="50"
                        id="city-header"
                        placeholder="<?php echo ucfirst(esc_html__('city', 'hotel-portfolio')) ?>"
                        aria-label="<?php echo ucfirst(esc_html__('city', 'hotel-portfolio')) ?>"
                    />
                </div>
                <ul class="select-options" id="city-options"></ul>
            </div>
        </div>

        <!-- Parent Brand Dropdown -->
        <div class="selection-hr last-selection">
            <div class="select-parent-brand" id="parent-brand-select">
                <label for="parent-brand-header" class="visually-hidden">Franchise Partner</label>
                <div class="select-header">
                    <input 
                        name="parent-brand"
                        type="text"
                        autocomplete="off"
                        maxlength="50"
                        id="parent-brand-header"
                        placeholder="Franchise Partner"
                        aria-label="Franchise Partner"
                    />
                </div>
                <ul class="select-options" id="parent-brand-options"></ul>
            </div>
        </div>	

        <!-- Brand Dropdown -->
        <div class="selection-hr">
            <div class="select-brand" id="brand-select">
                <label for="brand-header" class="visually-hidden"><?php echo ucfirst(esc_html__('brand', 'hotel-portfolio')) ?></label>
                <div class="select-header">
                    <input 
                        name="brand"
                        type="text"
                        autocomplete="off"
                        maxlength="50"
                        id="brand-header"
                        placeholder="<?php echo ucfirst(esc_html__('brand', 'hotel-portfolio')) ?>"
                        aria-label="<?php echo ucfirst(esc_html__('brand', 'hotel-portfolio')) ?>"
                    />
                </div>
                <ul class="select-options" id="brand-options"></ul>
            </div>
        </div>	

        <!-- Buttons -->
        <div class="btn-wrapper">
            <div id="btn-reset" role="button" tabindex="0" aria-label="Reset Search Filters">
                <img src="<?php echo esc_url(plugins_url('../img/restart_alt.svg', __FILE__)); ?>" alt="reset icon" />
                <div><span style="color:#181B20;"> Reset</span></div>
            </div>
        </div>
  </div>
  <div id="message-wrapper" role="status" aria-live="polite"></div>
</div>

<style>
.visually-hidden {
    position: absolute !important;
    height: 1px; width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
}
</style>
