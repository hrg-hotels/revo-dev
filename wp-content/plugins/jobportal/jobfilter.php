<?php
// Verhindere direkten Zugriff
defined('ABSPATH') or die('No script kiddies please!');
?>

<div id="scroll-link" class="search-wrapper">
  <div class="row-search" role="search" aria-label="<?php echo esc_attr__('Job search', 'jobportal'); ?>">

    <!-- Jobtitle -->
    <div class="selection-hr">
      <div class="select-jobtitle" id="jobtitle-select">
        <div class="select-header">
          <input
            name="jobtitle"
            type="text"
            id="jobtitle-header"
            placeholder="<?php echo esc_attr(ucfirst(__('More filters', 'jobportal'))); ?>"
            aria-label="<?php echo esc_attr(ucfirst(__('jobtitle', 'jobportal'))); ?>"
            autocomplete="off"
          />
        </div>
        <ul class="select-options" id="jobtitle-options" role="listbox" aria-labelledby="jobtitle-header"></ul>
      </div>
    </div>

    <!-- City -->
    <div class="selection-hr">
      <div class="select-city" id="city-select">
        <div class="select-header">
          <input
            name="city"
            type="text"
            id="city-header"
            placeholder="<?php echo esc_attr(ucfirst(__('city', 'jobportal'))); ?>"
            aria-label="<?php echo esc_attr(ucfirst(__('city', 'jobportal'))); ?>"
            autocomplete="off"
          />
        </div>
        <ul class="select-options" id="city-options" role="listbox" aria-labelledby="city-header"></ul>
      </div>
    </div>

    <!-- Brand -->
    <div class="selection-hr">
      <div class="select-brand" id="brand-select">
        <div class="select-header">
          <input
            name="brand"
            type="text"
            id="brand-header"
            placeholder="<?php echo esc_attr(ucfirst(__('brand', 'jobportal'))); ?>"
            aria-label="<?php echo esc_attr(ucfirst(__('brand', 'jobportal'))); ?>"
            autocomplete="off"
          />
        </div>
        <ul class="select-options" id="brand-options" role="listbox" aria-labelledby="brand-header"></ul>
      </div>
    </div>

    <!-- Department -->
    <div class="selection-hr last-selection">
      <div class="select-department" id="department-select">
        <div class="select-header">
          <input
            name="department"
            type="text"
            id="department-header"
            placeholder="<?php echo esc_attr(ucfirst(__('department', 'jobportal'))); ?>"
            aria-label="<?php echo esc_attr(ucfirst(__('department', 'jobportal'))); ?>"
            autocomplete="off"
          />
        </div>
        <ul class="select-options" id="department-options" role="listbox" aria-labelledby="department-header"></ul>
      </div>
    </div>

    <!-- Buttons -->
    <div class="btn-wrapper"> 
        <div id="btn-reset" type="button" aria-label="reset filters"> 
            <img src="<?php echo esc_url(plugins_url('assets/img/restart_alt.svg', __FILE__)); ?>" alt="reset" /> 
            <div><span style="color:#181B20;"> Reset</span></div> 
        </div> 
    </div>

  </div>

  <div id="message-wrapper"></div>
</div>
