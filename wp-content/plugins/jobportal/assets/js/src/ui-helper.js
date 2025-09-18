import $ from 'jquery';
import { setGlobalParams } from './state';
import { removeShowClass } from './modules/messageBox';
import { updateFilterCount } from './modules/extended-filter';
import { handleEvent } from './handleEvent';

/**
 * Bindet UI-Helfer wie den Reset-Button.
 * Aufruf in main.js nach DOMContentLoaded.
 */
export function initUIHelpers() {
  bindResetButton();
}

function bindResetButton() {
  $(document).off('click.ui-reset', '#btn-reset'); // doppelte Bindungen vermeiden
  $(document).on('click.ui-reset', '#btn-reset', function () {
    // 1) Message-Tags zurücksetzen & Not-Found-Graphic entfernen
    removeShowClass();
    $('.nfg').remove();

    // 2) Inputs und Optionen zurücksetzen
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

    // 3) Alle Badges (Extended Filter) zurücksetzen (Optik + ARIA)
    $('.badge')
      .removeClass('search-active')
      .attr('aria-checked', 'false');

    // 4) State leeren (Single source of truth)
    setGlobalParams({});

    // 5) Zähler aktualisieren (nur aus State)
    updateFilterCount($('#filter-count'));

    // 6) Pipeline starten:
    //    'replace' → nur das (leere) Objekt verwenden, Inputs ignorieren,
    //    pushArgToURL löscht damit alle bekannten Keys aus der URL.
    handleEvent({}, 'replace');
  });
}
