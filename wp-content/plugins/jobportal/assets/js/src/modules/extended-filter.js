// assets/js/src/modules/extended-filter.js
import $ from 'jquery';
import { getState, setGlobalParams } from '../state';
import { handleEvent } from '../handleEvent';

const SINGLE_GROUPS = ['careerlevels', 'employment-type', 'joblocation-type'];

/**
 * Accordion + Badges initialisieren.
 * Erwartetes Markup:
 * #ext-filter-head, #ext-filter-cont, #arrow-cont, #filter-count
 * .badge.careerlevels / .badge.employment-type / .badge.joblocation-type / .badge.keyword
 */
export function initAccordion() {
  const $head  = $('#ext-filter-head');
  const $panel = $('#ext-filter-cont');
  const $arrow = $('#arrow-cont');

  if (!$head.length || !$panel.length) return;

  // Start: zugeklappt
  $panel.hide().prop('hidden', true);
  $arrow.addClass('arrow-open');

  // ARIA
  $head.attr({
    role: 'button',
    tabindex: 0,
    'aria-controls': 'ext-filter-cont',
    'aria-expanded': 'false'
  });
  $panel.attr({ role: 'region', 'aria-labelledby': 'ext-filter-head' });

  function togglePanel() {
    const open = $head.attr('aria-expanded') === 'true';
    $head.attr('aria-expanded', String(!open));
    if (open) {
      $panel.slideUp(150, () => $panel.prop('hidden', true));
      $arrow.addClass('arrow-open');
    } else {
      $panel.prop('hidden', false).slideDown(150);
      $arrow.removeClass('arrow-open');
    }
  }

  $head.on('click', togglePanel);
  $head.on('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Badges tastaturfähig
  $('.badge').attr({ role: 'checkbox', tabindex: 0, 'aria-checked': 'false' });

  // Delegation: Klick/Keyboard -> toggleBadge
  $(document).on('click', '.badge', function () {
    toggleBadge($(this));
  });
  $(document).on('keydown', '.badge', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBadge($(this));
    }
  });

  // Initial Counter anzeigen
  updateFilterCount($('#filter-count'));
}

/**
 * Toggle eines Badges:
 * - schreibt DIREKT in globalParams (Single Source of Truth)
 * - aktualisiert die Optik (Klassen/ARIA)
 * - triggert deine Pipeline über handleEvent(globalParams)
 */
function toggleBadge($badge) {
  const name = ($badge.attr('name') || '').trim();
  if (!name) return;

  const gp = { ...(getState().globalParams || {}) };

  if ($badge.hasClass('keyword')) {
    // Multi-Select: Keyword in CSV toggeln
    gp.keyword = toggleKeywordInCommaList(gp.keyword, name);

    const activeNow = includesKeyword(gp.keyword, name);
    $badge
      .toggleClass('search-active', activeNow)
      .attr('aria-checked', String(activeNow));
  } else {
    // Single-Select: gesamte Gruppe resetten, dann ggf. setzen
    const group = SINGLE_GROUPS.find(g => $badge.hasClass(g));
    if (!group) return;

    const isAlreadyActive = ($badge.hasClass('search-active') && gp[group] === name);

    // Optik-Gruppe zurücksetzen
    $(`.badge.${group}`)
      .removeClass('search-active')
      .attr('aria-checked', 'false');

    if (isAlreadyActive) {
      // Deselektieren: Key entfernen
      delete gp[group];
    } else {
      // Auswählen: Key setzen
      gp[group] = name;
      $badge
        .addClass('search-active')
        .attr('aria-checked', 'true');
    }
  }

  // State aktualisieren (Single Source of Truth)
  setGlobalParams(gp);

  // Counter nur aus State berechnen
  updateFilterCount($('#filter-count'));

  // Zentrale Pipeline starten:
  // handleEvent pusht URL aus den aktuellen globalParams und ruft checkParams -> getParameter -> filterListByParams -> splittArray -> renderList
  handleEvent(getState().globalParams);
}

/**
 * Counter ausschließlich aus globalParams.
 */
export function updateFilterCount($countEl) {
  const { globalParams = {} } = getState();
  let count = 0;

  if (globalParams.careerlevels)        count++;
  if (globalParams['employment-type'])  count++;
  if (globalParams['joblocation-type']) count++;

  if (globalParams.keyword) {
    count += String(globalParams.keyword)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean).length;
  }

  if ($countEl && $countEl.length) $countEl.text(count);
}

/* ----------------- Helpers für Keywords (CSV) ----------------- */

function includesKeyword(csv, val) {
  return String(csv || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .includes(val);
}

function toggleKeywordInCommaList(csv, val) {
  const arr = String(csv || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const idx = arr.indexOf(val);
  if (idx >= 0) {
    arr.splice(idx, 1); // entfernen
  } else {
    arr.push(val);      // hinzufügen
  }
  return arr.join(',');
}
