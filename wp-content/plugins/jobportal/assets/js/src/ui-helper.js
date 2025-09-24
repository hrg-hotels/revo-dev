// assets/js/src/modules/ui-helper.js
import $ from 'jquery';
import { removeShowClass } from './modules/messageBox';
import { updateFilterCount } from './modules/extended-filter';
import { handleEvent } from './handleEvent';

// Alle bekannten Query-Keys (Inputs + Extended Filter)
const KNOWN_KEYS = [
  'jobtitle', 'city', 'country', 'brand', 'department',
  'careerlevels', 'employment-type', 'joblocation-type', 'keyword'
];

/**
 * UI-Helfer initialisieren (z. B. Reset-Button).
 * Aufruf in main.js nach DOMContentLoaded.
 */
export function initUIHelpers() {
  bindResetButton();
}

function bindResetButton() {
  // doppelte Bindungen vermeiden
  $(document).off('click.ui-reset', '#btn-reset');

  $(document).on('click.ui-reset', '#btn-reset', function () {
    // 1) Message-Tags & Not-Found-Graphic entfernen
    removeShowClass();
    $('.nfg').remove();

    // 2) Inputs & Optionen zurücksetzen
    const filters = [
      { id: 'jobtitle',   placeholder: 'Jobtitle' },
      { id: 'city',       placeholder: 'city' },
      { id: 'country',    placeholder: 'country' },
      { id: 'brand',      placeholder: 'brand' },
      { id: 'department', placeholder: 'Department' }
    ];

    filters.forEach(({ id, placeholder }) => {
      $(`#${id}-header`).val('').attr('placeholder', placeholder);
      $(`#${id}-options li`).show();
      $(`.selection-hr input[name="${id.replace('-', ' ')}"]`).val('');
    });

    // 3) Alle Badges (Extended Filter) optisch & ARIA zurücksetzen
    $('.badge')
      .removeClass('search-active')
      .attr('aria-checked', 'false');

    // 4) Counter direkt aus DOM neu berechnen
    updateFilterCount($('#filter-count'));

    // 5) URL leeren: Patch mit allen Keys -> '' (damit pushArgToURL sie löscht)
    const clearPatch = KNOWN_KEYS.reduce((acc, k) => (acc[k] = '', acc), {});

    // 6) Zentrale Pipeline starten
    //    handleEvent merged mit bestehenden URL-Params und löscht leere Keys
    handleEvent(clearPatch);
  });
}
