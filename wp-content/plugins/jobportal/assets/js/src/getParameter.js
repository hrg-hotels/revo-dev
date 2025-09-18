// assets/js/src/getParameter.js
import $ from 'jquery';
import { setGlobalParams } from './state';
import { filterListByParams } from './modules/filters';
import { updateFilterCount } from './modules/extended-filter';

export function getParameter() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());

  // Inputs setzen
  $('.selection-hr input[name="jobtitle"]').val(params.jobtitle || '');
  $('.selection-hr input[name="city"]').val(params.city || '');
  $('.selection-hr input[name="brand"]').val(params.brand || '');
  $('.selection-hr input[name="department"]').val(params.department || '');

  // Badges setzen (Single-Select resetten)
  if ('careerlevels' in params) {
    $('.badge.careerlevels').removeClass('search-active').css('background', '').attr('aria-checked','false');
    if (params.careerlevels)
      $(`.badge.careerlevels[name="${params.careerlevels}"]`).addClass('search-active').attr('aria-checked','true');
  }
  if ('employment-type' in params) {
    $('.badge.employment-type').removeClass('search-active').css('background', '').attr('aria-checked','false');
    if (params['employment-type'])
      $(`.badge.employment-type[name="${params['employment-type']}"]`).addClass('search-active').attr('aria-checked','true');
  }
  if ('joblocation-type' in params) {
    $('.badge.joblocation-type').removeClass('search-active').css('background', '').attr('aria-checked','false');
    if (params['joblocation-type'])
      $(`.badge.joblocation-type[name="${params['joblocation-type']}"]`).addClass('search-active').attr('aria-checked','true');
  }
  // Keywords (Multi)
  if ('keyword' in params) {
    $('.badge.keyword').removeClass('search-active').css('background', '').attr('aria-checked','false');
    if (params.keyword) {
      params.keyword.split(',').map(s=>s.trim()).filter(Boolean).forEach(kw => {
        $(`.badge.keyword[name="${kw}"]`).addClass('search-active').attr('aria-checked','true');
      });
    }
  }

  // State setzen
  setGlobalParams(params);

  // Counter aktualisieren
  updateFilterCount($('#filter-count'));

  // zentrale Filter/Render-Pipeline
  filterListByParams();
}
