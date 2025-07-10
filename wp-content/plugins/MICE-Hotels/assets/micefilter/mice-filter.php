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
                <label for="country-header" class="visually-hidden"><?php esc_html_e('Country', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="country" type="text" autocomplete="off" id="country-header" maxlength="30"
                        placeholder="<?php echo esc_attr(ucfirst(__('country', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('Country', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Enter country name', 'hotel-portfolio'); ?>" />
                </div>
                <ul class="select-options" id="country-options"></ul>
            </div>
        </div>

        <!-- City Dropdown -->
        <div class="selection-hr">
            <div class="select-city" id="city-select">
                <label for="city-header" class="visually-hidden"><?php esc_html_e('City', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="city" type="text" autocomplete="off" id="city-header" maxlength="50"
                        placeholder="<?php echo esc_attr(ucfirst(__('city', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('City', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Enter city name', 'hotel-portfolio'); ?>" />
                </div>
                <ul class="select-options" id="city-options"></ul>
            </div>
        </div>

        <!-- Parent Brand Dropdown -->
        <div class="selection-hr last-selection">
            <div class="select-parent-brand" id="parent-brand-select">
                <label for="parent-brand-header" class="visually-hidden"><?php esc_html_e('Franchise Partner', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="parent-brand" type="text" autocomplete="off" id="parent-brand-header" maxlength="50"
                        placeholder="<?php esc_attr_e('Franchise Partner', 'hotel-portfolio'); ?>"
                        aria-label="<?php esc_attr_e('Franchise Partner', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Enter franchise partner name', 'hotel-portfolio'); ?>" />
                </div>
                <ul class="select-options" id="parent-brand-options"></ul>
            </div>
        </div>

        <!-- Brand Dropdown -->
        <div class="selection-hr">
            <div class="select-brand" id="brand-select">
                <label for="brand-header" class="visually-hidden"><?php esc_html_e('Brand', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="brand" type="text" autocomplete="off" id="brand-header" maxlength="50"
                        placeholder="<?php echo esc_attr(ucfirst(__('brand', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('Brand', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Enter brand name', 'hotel-portfolio'); ?>" />
                </div>
                <ul class="select-options" id="brand-options"></ul>
            </div>
        </div>

        <!-- Area Dropdown -->
        <div class="selection-hr">
            <div class="select-area" id="area-select">
                <label for="area-header" class="visually-hidden"><?php esc_html_e('Area', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="area" type="text" class="read-only" autocomplete="off" id="area-header" maxlength="50"
                        placeholder="<?php echo esc_attr(ucfirst(__('area', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('Area', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Area (read only)', 'hotel-portfolio'); ?>" readonly />
                </div>
                <ul class="select-options" id="area-options"></ul>
            </div>
        </div>

        <!-- People Dropdown -->
        <div class="selection-hr">
            <div class="select-people" id="people-select">
                <label for="people-header" class="visually-hidden"><?php esc_html_e('People', 'hotel-portfolio'); ?></label>
                <div class="select-header">
                    <input name="people" type="text" class="read-only" autocomplete="off" id="people-header"
                        placeholder="<?php echo esc_attr(ucfirst(__('people', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('People', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Number of people (read only)', 'hotel-portfolio'); ?>" readonly />
                </div>
                <ul class="select-options" id="people-options"></ul>
            </div>
        </div>

        <!-- Buttons -->
        <div class="btn-wrapper">
            <div id="btn-reset" role="button" tabindex="0" aria-label="<?php esc_attr_e('Reset all filters', 'hotel-portfolio'); ?>">
                <img src="<?php echo esc_url(plugins_url('../img/restart_alt.svg', __FILE__)); ?>" alt="<?php esc_attr_e('Reset icon', 'hotel-portfolio'); ?>" />
                <div><span style="color:#181B20;"><?php esc_html_e('Reset', 'hotel-portfolio'); ?></span></div>
            </div>
        </div>
    </div>

    <!-- ARIA live region for screen reader announcements -->
    <div id="message-wrapper" role="status" aria-live="polite"></div>
</div>

<!-- Accessibility styles -->
<style>
.visually-hidden {
    position: absolute !important;
    height: 1px; width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
}
</style>
