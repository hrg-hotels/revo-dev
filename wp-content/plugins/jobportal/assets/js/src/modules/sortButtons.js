// assets/js/src/modules/sortButtons.js
import $ from 'jquery';
import { sortByDate, sortAlphabetically } from '../sort';

/**
 * Initialisiert die Sortier-Buttons (nach Datum & alphabetisch)
 * Fügt Icons, aktive Zustände und Toggle-Funktionalität hinzu.
 */
export function initSortButtons() {
  const wrapper = $('#message-wrapper');
  if (!wrapper.length || $('#sort-date-btn').length) return; // schon vorhanden?

  // Sortierstatus speichern
  let dateAscending = false;
  let alphaAscending = true;

  // === Buttons erstellen ===
  const sortContainer = $('<div class="sort-container"></div>');

  const sortDateBtn = $(`
    <button id="sort-date-btn" class="btn btn-sort" title="Sort by date">
      <img src="${imgPath}calendar_today.png" alt="Sort by date" class="icon-20">
      <span class="sort-label">Date ↓</span>
    </button>
  `);

  const sortAlphaBtn = $(`
    <button id="sort-alpha-btn" class="btn btn-sort" title="Sort alphabetically">
      <img src="${imgPath}icon_abc.svg" alt="Sort alphabetically" class="icon-20" style="width:22px;">
      <span class="sort-label">A–Z</span>
    </button>
  `);

  sortContainer.append(sortDateBtn, sortAlphaBtn);
  wrapper.append(sortContainer); // Buttons in Message-Wrapper einfügen

  // === Eventlistener ===
  sortDateBtn.on('click', () => {
    dateAscending = !dateAscending;
    sortByDate(dateAscending);

    const arrow = dateAscending ? '↑' : '↓';
    sortDateBtn.find('.sort-label').text(`Date ${arrow}`);
    sortAlphaBtn.removeClass('active');
    sortDateBtn.addClass('active');
  });

  sortAlphaBtn.on('click', () => {
    alphaAscending = !alphaAscending;
    sortAlphabetically(alphaAscending);

    const label = alphaAscending ? 'A–Z' : 'Z–A';
    sortAlphaBtn.find('.sort-label').text(label);
    sortDateBtn.removeClass('active');
    sortAlphaBtn.addClass('active');
  });
}
