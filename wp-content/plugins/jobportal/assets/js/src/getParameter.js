// assets/js/src/getParameter.js
import $ from 'jquery';
import { setGlobalParams, setReferenceId } from './state';
import { filterListByParams } from './modules/filters';
import { updateFilterCount } from './modules/extended-filter';

/**
 * Liest URL-Parameter, schreibt sie in Inputs & Badges
 * und setzt globalParams im State. Danach wird die zentrale
 * Pipeline (filterListByParams) angestoßen.
 */
export function getParameter() {
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );
console.log('paramssss:', params);
  /** ---------------- Inputs setzen ---------------- */
  $('.selection-hr input[name="jobtitle"]').val(params.jobtitle || '');
  $('.selection-hr input[name="city"]').val(params.city || '');
  $('.selection-hr input[name="brand"]').val(params.brand || '');
  $('.selection-hr input[name="department"]').val(params.department || '');

  /** ---------------- Badges zurücksetzen ---------------- */
  function resetGroup(selector) {
    $(selector)
      .removeClass('search-active')
      .attr('aria-checked', 'false');
  }

  // Careerlevels (Single-Select)
  if ('careerlevels' in params) {
    resetGroup('.badge.careerlevels');
    if (params.careerlevels) {
      $(`.badge.careerlevels[name="${params.careerlevels}"]`)
        .addClass('search-active')
        .attr('aria-checked', 'true');
    }
  }

  // Employment-Type (Single-Select)
  if ('employment-type' in params) {
    resetGroup('.badge.employment-type');
    if (params['employment-type']) {
      $(`.badge.employment-type[name="${params['employment-type']}"]`)
        .addClass('search-active')
        .attr('aria-checked', 'true');
    }
  }

  // Joblocation-Type (Single-Select)
  if ('joblocation-type' in params) {
    resetGroup('.badge.joblocation-type');
    if (params['joblocation-type']) {
      $(`.badge.joblocation-type[name="${params['joblocation-type']}"]`)
        .addClass('search-active')
        .attr('aria-checked', 'true');
    }
  }

  // Keywords (Multi-Select)
  if ('keyword' in params) {
    resetGroup('.badge.keyword');
    if (params.keyword) {
      params.keyword
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((kw) => {
          $(`.badge.keyword[name="${kw}"]`)
            .addClass('search-active')
            .attr('aria-checked', 'true');
        });
    }
  }
  /** ---------------- State & Pipeline ---------------- */

  setGlobalParams(params);
    if (!params.reference_id) {
    setReferenceId("");
  } else {
    setReferenceId(params.reference_id);
  };
  updateFilterCount($('#filter-count'));
  filterListByParams();
}
