<?php defined('ABSPATH') || exit; ?>

<div id="extended-filter" class="extended-filter" aria-labelledby="ext-filter-heading">
  <div class="ext-filter-wrap" id="ext-filter-Wrap">

    <!-- Header / Toggle -->
    <div class="ext-filter-header" id="ext-filter-head" role="button" tabindex="0"
         aria-controls="ext-filter-cont" aria-expanded="false">
      <p id="ext-filter-heading" class="article-title black">
        <?php echo esc_attr(ucfirst(__('more-filters', 'jobportal'))); ?>
        <i aria-hidden="true"></i>
      </p>

      <div class="filter-set red" aria-live="polite">
        <div class="red-circle" id="filter-count">0</div>
        <div class="font-12" style="padding-top: 10px;">
          <?php echo esc_attr(ucfirst(__('filters-set', 'jobportal'))); ?>
        </div>
      </div>

      <div id="arrow-cont" class="arrow-open" aria-hidden="true">
        <img
          src="<?php echo esc_url(plugins_url('assets/img/dropdown-arrow-body.svg', __FILE__)); ?>"
          alt=""
          class="arrow-down"
        />
      </div>
    </div>

    <!-- Panel -->
    <div class="ext-open accordion-content" id="ext-filter-cont" role="region" aria-labelledby="ext-filter-head">
      <!-- Col 1: Career levels -->
      <div class="extended-search">
        <p class="heading black"><?php echo esc_attr(ucfirst(__('Career levels', 'jobportal'))); ?>:</p>
        <div class="acc-col">
          <!-- name-Attribute bleiben deine kanonischen Werte (für URL/Filter) -->
          <div class="badge careerlevels" name="Ausbildung" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('apprenticeship', 'jobportal'))); ?></p>
          </div>
          <div class="badge careerlevels" name="Student" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('student-jobs', 'jobportal'))); ?></p>
          </div>
          <div class="badge careerlevels" name="berufseinsteiger" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('career-starters', 'jobportal'))); ?></p>
          </div>
          <div class="badge careerlevels" name="berufserfahren" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('experienced-professionals', 'jobportal'))); ?></p>
          </div>
          <div class="badge careerlevels" name="quereinsteiger" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('career-changer', 'jobportal'))); ?></p>
          </div>
        </div>
      </div>

      <!-- Col 2: Employment type -->
      <div class="extended-search">
        <p class="heading black"><?php echo esc_attr(ucfirst(__('Employment type', 'jobportal'))); ?>:</p>
        <div class="acc-col">
          <div class="badge employment-type" name="minijob" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('Minijob', 'jobportal'))); ?></p>
          </div>
          <div class="badge employment-type" name="teilzeit" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('part-time', 'jobportal'))); ?></p>
          </div>
          <div class="badge employment-type" name="vollzeit" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('full-time', 'jobportal'))); ?></p>
          </div>
          <div class="badge employment-type" name="stundenweise" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('hourly', 'jobportal'))); ?></p>
          </div>
        </div>
      </div>

      <!-- Col 3: Job location type -->
      <div class="extended-search">
        <p class="heading black"><?php echo esc_attr(ucfirst(__('Job location type', 'jobportal'))); ?>:</p>
        <div class="acc-col">
          <div class="badge joblocation-type" name="remote" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('Remote', 'jobportal'))); ?></p>
          </div>
          <div class="badge joblocation-type" name="präsenz" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('on-site', 'jobportal'))); ?></p>
          </div>
          <div class="badge joblocation-type" name="hybrid" role="checkbox" tabindex="0" aria-checked="false">
            <p><?php echo esc_attr(ucfirst(__('Hybrid', 'jobportal'))); ?></p>
          </div>
        </div>
      </div>

      <!-- Col 4: (optional) Keywords -->
      <div class="extended-search black" style="display:none;">
        <p class="heading black"><?php echo esc_attr(ucfirst(__('Keywords', 'jobportal'))); ?>:</p>
        <div class="acc-col">
          <div class="badge keyword" name="keyword-01" role="checkbox" tabindex="0" aria-checked="false">
            <p>keyword-01</p>
          </div>
          <div class="badge keyword" name="keyword-02" role="checkbox" tabindex="0" aria-checked="false">
            <p>keyword-02</p>
          </div>
          <div class="badge keyword" name="keyword-03" role="checkbox" tabindex="0" aria-checked="false">
            <p>keyword-03</p>
          </div>
        </div>
      </div>
    </div><!-- /panel -->

  </div>
</div>
