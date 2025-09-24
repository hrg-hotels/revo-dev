// assets/js/src/modules/extended-filter.js
import $ from 'jquery';
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

  // Events namespacen, doppelte Bindings verhindern
  $head.off('click.extHead').on('click.extHead', togglePanel);
  $head.off('keydown.extHead').on('keydown.extHead', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Badges tastaturfähig
  $('.badge').attr({ role: 'checkbox', tabindex: 0, 'aria-checked': 'false' });

  // Delegation: Klick/Keyboard -> toggleBadge
  $(document).off('click.extBadge', '.badge').on('click.extBadge', '.badge', function () {
    toggleBadge($(this)); // WICHTIG: $badge wird übergeben; KEIN $(this) in der Funktion selbst benutzen
  });
  $(document).off('keydown.extBadge', '.badge').on('keydown.extBadge', '.badge', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBadge($(this));
    }
  });

  // Initial Counter (aus DOM) anzeigen
  updateFilterCount($('#filter-count'));
}

/**
 * Toggle eines Badges:
 * - ändert NUR die DOM-Optik (Klassen/ARIA)
 * - baut ein Patch-Objekt aus der aktuellen DOM-Auswahl
 * - triggert deine Pipeline über handleEvent(patch)
 */
function toggleBadge($badge) {
  if (!$badge || !$badge.length) return;

  const name = ($badge.attr('name') || '').trim();
  if (!name) return;

  // Gruppe bestimmen
  const group =
    $badge.hasClass('careerlevels')     ? 'careerlevels' :
    $badge.hasClass('employment-type')  ? 'employment-type' :
    $badge.hasClass('joblocation-type') ? 'joblocation-type' :
    $badge.hasClass('keyword')          ? 'keyword' : null;

  if (!group) return;

  let patch = {};

  if (group === 'keyword') {
    // Multi-Select: einzelnes Badge toggeln
    const willActivate = !$badge.hasClass('search-active');
    $badge
      .toggleClass('search-active', willActivate)
      .attr('aria-checked', String(willActivate));

    // Patch = gesamte aktuelle Keyword-Liste ('' → URL-Key wird gelöscht)
    const keywords = collectNames('.badge.keyword.search-active');
    patch.keyword = keywords.join(',');
  } else {
    // Single-Select: direktes Umschalten innerhalb der Gruppe
    const wasActive = $badge.hasClass('search-active');

    // Gruppe im DOM leeren
    $(`.badge.${group}`)
      .removeClass('search-active')
      .attr('aria-checked', 'false');

    if (wasActive) {
      // Deselect → Key explizit leeren, damit er aus der URL entfernt wird
      patch[group] = '';
    } else {
      // Neues Badge aktivieren
      $badge
        .addClass('search-active')
        .attr('aria-checked', 'true');
      patch[group] = name;
    }
  }

  // Counter sofort aus DOM aktualisieren
  updateFilterCount($('#filter-count'));

  // Zentrale Pipeline starten (URL mergen, leere Keys löschen, dann checkParams → ...)
  handleEvent(patch);
}

/**
 * Zähler ausschließlich aus DOM (aktive Badges).
 * Zeigt: 1 pro aktivem Single-Select + 1 pro aktivem Keyword.
 */
export function updateFilterCount($countEl) {
  const n = $('.badge.search-active').length;
  if ($countEl && $countEl.length) $countEl.text(n);
  $('#ext-filter-head').toggleClass('has-active', n > 0); // optionales UI-Feedback
}

/* ----------------- Helpers ----------------- */

function collectNames(selector) {
  return $(selector)
    .map(function () { return ($(this).attr('name') || '').trim(); })
    .get()
    .filter(Boolean);
}
