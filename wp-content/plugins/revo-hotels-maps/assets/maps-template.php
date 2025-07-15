<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');

?>
<script>
    var hotelFilterTranslations = {
        country: "<?php echo esc_js(ucfirst(__('country', 'revo-plugin-translation'))); ?>",
        city: "<?php echo esc_js(ucfirst(__('city', 'revo-plugin-translation'))); ?>",
        brand: "<?php echo esc_js(ucfirst(__('brand', 'revo-plugin-translation'))); ?>",
        noResult: "<?php echo esc_js(ucfirst(__('noResult', 'revo-plugin-translation'))); ?>",
        searchResultet: "<?php echo esc_js(ucfirst(__('searchResultet', 'revo-plugin-translation'))); ?>",
        hits: "<?php echo esc_js(ucfirst(__('hits', 'revo-plugin-translation'))); ?>",
        yourSelection: "<?php echo esc_js(ucfirst(__('yourSelection', 'revo-plugin-translation'))); ?>",
        consentText: "<?php echo esc_js(ucfirst(__('consentText', 'revo-plugin-translation'))); ?>",
        consentHeadline: "<?php echo esc_js(ucfirst(__('consentHeadline', 'revo-plugin-translation'))); ?>",
        showMap: "<?php echo esc_js(ucfirst(__('showMap', 'revo-plugin-translation'))); ?>",
        noHotelsFound: "<?php echo esc_js(ucfirst(__('noHotelsFound', 'revo-plugin-translation'))); ?>",
        noResultsFound: "<?php echo esc_js(ucfirst(__('noResultsFound', 'revo-plugin-translation'))); ?>",
        discoverMore: "<?php echo esc_js(ucfirst(__('discover-more', 'revo-plugin-translation'))); ?>",
        conferenceSpace: "<?php echo esc_js(ucfirst(__('conference-space', 'revo-plugin-translation'))); ?>",
        numberOfParticipants: "<?php echo esc_js(ucfirst(__('number-of-participants', 'revo-plugin-translation'))); ?>"

    };

</script>

<div id="scroll-link" class="search-wrapper">
<!-- Grid/Maps View Button -->
  <div class="btn-wrapper-view">
    <div class="btn-view-container">
      <a id="grid-view-btn" class="btn btn-view" href="#" role="button" aria-label="Switch to grid view">
        <img class="view-icon" src="<?php echo esc_url(plugins_url('img/list_alt.svg', __FILE__)); ?>" alt="Map view icon" /> 
        <?php echo ucfirst(esc_html__('grid-view', 'revo-plugin-translation')) ?>
      </a>
    </div> 
    <div class="btn-view-container">
      <a id="maps-view-btn" class="btn btn-view active-view" href="#" role="button" aria-label="Switch to map view">
        <img class="view-icon" src="<?php echo esc_url(plugins_url('img/map_active.svg', __FILE__)); ?>" alt="Grid view icon" /> 
        <?php echo ucfirst(esc_html__('map-view', 'revo-plugin-translation')) ?>
      </a>
    </div>
  </div>
  <div class="row-search">

    <!-- Country Dropdown -->
    <div class="selection-hr">
      <div class="select-country" id="country-select">
        <div class="select-header">
          <input name="country" type="text" autocomplete="off" maxlength="30"
                 id="country-header"
                 placeholder="<?php echo ucfirst(esc_html__('country', 'revo-plugin-translation')) ?>"
                 aria-label="Country" 
                 aria-controls="country-options"
                 aria-expanded="false"
                    />
        </div>
        <ul class="select-options" id="country-options" role="listbox" tabindex="-1" aria-label="Country options"></ul>
      </div>
    </div>

    <!-- City Dropdown -->
    <div class="selection-hr">
      <div class="select-city" id="city-select">
        <div class="select-header">
          <input name="city" type="text" autocomplete="off" id="city-header" maxlength="50"
                 placeholder="<?php echo ucfirst(esc_html__('city', 'revo-plugin-translation')) ?>"
                 aria-label="City"
                 aria-controls="city-options"
                 aria-expanded="false"
                    />
        </div>
        <ul class="select-options" id="city-options" role="listbox" tabindex="-1" aria-label="City options"></ul>
      </div>
    </div>

    <!-- Parent Brand Dropdown -->
    <div class="selection-hr last-selection">
      <div class="select-parent-brand" id="parent-brand-select">
        <div class="select-header">
          <input name="parent-brand" type="text" autocomplete="off" maxlength="50" id="parent-brand-header"
                 placeholder="Franchise Partner"
                 aria-label="Franchise Partner"  
                 aria-controls="parent-brand-options"
                    />
        </div>
        <ul class="select-options" id="parent-brand-options" role="listbox" tabindex="-1" aria-label="Franchise partner options"></ul>
      </div>
    </div>

    <!-- Brand Dropdown -->
    <div class="selection-hr">
      <div class="select-brand" id="brand-select">
        <div class="select-header">
          <input name="brand" type="text" autocomplete="off" id="brand-header" maxlength="50"
                 placeholder="<?php echo ucfirst(esc_html__('brand', 'revo-plugin-translation')) ?>"
                 aria-label="Brand"
                 aria-controls="brand-options"
                    />
        </div>
        <ul class="select-options" id="brand-options" role="listbox" tabindex="-1" aria-label="Brand options"></ul>
      </div>
    </div>

    <!-- Object Type Dropdown -->
    <div class="selection-hr">
      <div class="select-object-type" id="object-type-select">
        <div class="select-header">
          <input name="object-type" type="text" autocomplete="off" id="object-type-header" maxlength="20"
                 placeholder="All hotels"
                 aria-label="Object type"          
                 aria-controls="object-type-options"
                 aria-expanded="false"
                    />
        </div>
        <ul class="select-options" id="object-type-options" role="listbox" tabindex="-1" aria-label="Object type options"></ul>
      </div>
    </div>
            <!-- Area Dropdown -->
        <div id="areaEl" class="selection-hr mice-only">
            <div class="select-area" id="area-select">
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

        <div id="peopleEl" class="selection-hr mice-only">
            <div class="select-people" id="people-select">
                <div class="select-header">
                    <input name="people" type="text" class="read-only" autocomplete="off" id="people-header"
                        placeholder="<?php echo esc_attr(ucfirst(__('people', 'hotel-portfolio'))); ?>"
                        aria-label="<?php esc_attr_e('People', 'hotel-portfolio'); ?>"
                        title="<?php esc_attr_e('Number of people (read only)', 'hotel-portfolio'); ?>" readonly />
                </div>
                <ul class="select-options" id="people-options"></ul>
            </div>
        </div>

      <div id="btn-reset" role="button" tabindex="0" aria-label="Reset filter selection">
        <img src="<?php echo esc_url(plugins_url('img/restart_alt.svg', __FILE__)); ?>" alt="Reset icon" />
      <div style="color:#181B20; height:32px; padding-top: 6px;">Reset</div>
    </div>


  </div>

  <div id="message-wrapper"></div>
</div>

<div id="revo-hotels-map" style="width: 100%; height: 600px; margin-top: 20px;"></div>



  <!--Image path for the JavaScript file -->
<script>
    let imgPath = "<?php echo esc_url(plugins_url('/img/', __FILE__)); ?>";
    let imgUpl = "<?php echo esc_url(wp_upload_dir()['baseurl']); ?>";
</script>