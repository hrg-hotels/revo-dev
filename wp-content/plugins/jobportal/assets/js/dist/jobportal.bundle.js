/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/css/src/index.css":
/*!**********************************!*\
  !*** ./assets/css/src/index.css ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/js/src/checkParams.js":
/*!**************************************!*\
  !*** ./assets/js/src/checkParams.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkParams: function() { return /* binding */ checkParams; }
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./assets/js/src/state.js");
/* harmony import */ var _modules_dropdowns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dropdowns */ "./assets/js/src/modules/dropdowns.js");
/* harmony import */ var _modules_pagination__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/pagination */ "./assets/js/src/modules/pagination.js");
/* harmony import */ var _modules_messageBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/messageBox */ "./assets/js/src/modules/messageBox.js");
/* harmony import */ var _getParameter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getParameter */ "./assets/js/src/getParameter.js");
// assets/js/src/modules/checkParams.js





function checkParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.toString()) {
    console.log('No URL parameters found 1', (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().resultJobArr);
    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setResultJobs)((0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().fetchedJobs);
    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setGlobalParams)({});
    (0,_modules_dropdowns__WEBPACK_IMPORTED_MODULE_1__.generateDropdownOptions)();
    (0,_modules_pagination__WEBPACK_IMPORTED_MODULE_2__.splittArray)();
    (0,_modules_messageBox__WEBPACK_IMPORTED_MODULE_3__.message)();
    console.log('No URL parameters found 2', (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().resultJobArr);
  } else {
    (0,_getParameter__WEBPACK_IMPORTED_MODULE_4__.getParameter)();
    console.log('URL parameters found', (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().resultJobArr);
  }
}

/***/ }),

/***/ "./assets/js/src/dom.js":
/*!******************************!*\
  !*** ./assets/js/src/dom.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getExtendedFilterHook: function() { return /* binding */ getExtendedFilterHook; },
/* harmony export */   getJobPortalWrapper: function() { return /* binding */ getJobPortalWrapper; },
/* harmony export */   getRenderHook: function() { return /* binding */ getRenderHook; },
/* harmony export */   initDom: function() { return /* binding */ initDom; }
/* harmony export */ });
const dom = {
  renderHook: null,
  jobPortalWrapper: document.getElementById("jobportal-wrapper"),
  extendedFilterHook: document.getElementById("extended-filter")
};
function initDom() {
  dom.renderHook = document.getElementById("jobportal-container");
}
function getRenderHook() {
  return dom.renderHook;
}
function getJobPortalWrapper() {
  return dom.jobPortalWrapper;
}
function getExtendedFilterHook() {
  return dom.extendedFilterHook;
}

/***/ }),

/***/ "./assets/js/src/getParameter.js":
/*!***************************************!*\
  !*** ./assets/js/src/getParameter.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getParameter: function() { return /* binding */ getParameter; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./assets/js/src/state.js");
/* harmony import */ var _modules_filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/filters */ "./assets/js/src/modules/filters.js");
/* harmony import */ var _modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/extended-filter */ "./assets/js/src/modules/extended-filter.js");
// assets/js/src/getParameter.js




function getParameter() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());

  // Inputs setzen
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="jobtitle"]').val(params.jobtitle || '');
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="city"]').val(params.city || '');
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="brand"]').val(params.brand || '');
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="department"]').val(params.department || '');

  // Badges setzen (Single-Select resetten)
  if ('careerlevels' in params) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge.careerlevels').removeClass('search-active').css('background', '').attr('aria-checked', 'false');
    if (params.careerlevels) jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.badge.careerlevels[name="${params.careerlevels}"]`).addClass('search-active').attr('aria-checked', 'true');
  }
  if ('employment-type' in params) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge.employment-type').removeClass('search-active').css('background', '').attr('aria-checked', 'false');
    if (params['employment-type']) jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.badge.employment-type[name="${params['employment-type']}"]`).addClass('search-active').attr('aria-checked', 'true');
  }
  if ('joblocation-type' in params) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge.joblocation-type').removeClass('search-active').css('background', '').attr('aria-checked', 'false');
    if (params['joblocation-type']) jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.badge.joblocation-type[name="${params['joblocation-type']}"]`).addClass('search-active').attr('aria-checked', 'true');
  }
  // Keywords (Multi)
  if ('keyword' in params) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge.keyword').removeClass('search-active').css('background', '').attr('aria-checked', 'false');
    if (params.keyword) {
      params.keyword.split(',').map(s => s.trim()).filter(Boolean).forEach(kw => {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.badge.keyword[name="${kw}"]`).addClass('search-active').attr('aria-checked', 'true');
      });
    }
  }

  // State setzen
  (0,_state__WEBPACK_IMPORTED_MODULE_1__.setGlobalParams)(params);

  // Counter aktualisieren
  (0,_modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__.updateFilterCount)(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#filter-count'));

  // zentrale Filter/Render-Pipeline
  (0,_modules_filters__WEBPACK_IMPORTED_MODULE_2__.filterListByParams)();
}

/***/ }),

/***/ "./assets/js/src/handleEvent.js":
/*!**************************************!*\
  !*** ./assets/js/src/handleEvent.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleEvent: function() { return /* binding */ handleEvent; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _pushArgToURL__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pushArgToURL */ "./assets/js/src/pushArgToURL.js");
/* harmony import */ var _checkParams__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkParams */ "./assets/js/src/checkParams.js");
// assets/js/src/handleEvent.js




/**
 * Zentraler Einstieg bei jeder Änderung (Inputs/Badges/Enter/etc.)
 * - liest Input-Felder
 * - merged optionalen Patch (Badges)
 * - aktualisiert URL
 * - triggert checkParams() (→ Rest der Pipeline)
 */
function handleEvent(patch = {}) {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.nfg').remove();
  const jobtitle = (jquery__WEBPACK_IMPORTED_MODULE_0___default()('#jobtitle-header').val() || '').trim();
  const city = (jquery__WEBPACK_IMPORTED_MODULE_0___default()('#city-header').val() || '').trim();
  const department = (jquery__WEBPACK_IMPORTED_MODULE_0___default()('#department-header').val() || '').trim();
  const brand = (jquery__WEBPACK_IMPORTED_MODULE_0___default()('#brand-header').val() || '').trim();
  const argObj = {};
  if (jobtitle) argObj.jobtitle = jobtitle;
  if (brand) argObj.brand = brand;
  if (city) argObj.city = city;
  if (department) argObj.department = department;

  // Badge-Patch überschreibt Input-Keys (falls gleichnamig)
  Object.assign(argObj, patch);

  // URL setzen/aufräumen
  (0,_pushArgToURL__WEBPACK_IMPORTED_MODULE_1__.pushArgToURL)(argObj);

  // → ab hier übernimmt deine Pipeline
  (0,_checkParams__WEBPACK_IMPORTED_MODULE_2__.checkParams)();
}

/***/ }),

/***/ "./assets/js/src/modules/dropdowns.js":
/*!********************************************!*\
  !*** ./assets/js/src/modules/dropdowns.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateDropdownOptions: function() { return /* binding */ generateDropdownOptions; },
/* harmony export */   setupDropdown: function() { return /* binding */ setupDropdown; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _handleEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../handleEvent */ "./assets/js/src/handleEvent.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");
/* harmony import */ var _checkParams__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../checkParams */ "./assets/js/src/checkParams.js");




function generateDropdownOptions() {
  let localResultJobArr = (0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)().resultJobArr;
  const getUniqueSortedValues = key => {
    return [...new Set(localResultJobArr.map(h => h[key]).filter(Boolean))].sort();
  };
  const jobtitle = getUniqueSortedValues('title');
  const cities = getUniqueSortedValues('city');
  const brand = getUniqueSortedValues('companyname');
  const department = getUniqueSortedValues('department');
  const populateDropdown = (id, values) => {
    const dropdown = document.getElementById(id);
    if (!dropdown) {
      console.warn(`Dropdown with ID "${id}" not found.`);
      return;
    }
    dropdown.innerHTML = values.map(v => `<li data-value="${v}">${v}</li>`).join('');
  };

  // Populiere Dropdowns
  populateDropdown("jobtitle-options", jobtitle);
  populateDropdown("city-options", cities);
  populateDropdown("brand-options", brand);
  populateDropdown("department-options", department);
}

// Verstecke die Dropdown-Optionen initial
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").hide();
function setupDropdown(headerId, optionsId) {
  const header = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#" + headerId);
  const options = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#" + optionsId);

  // Falls der Clear-Button noch nicht existiert, füge ihn hinzu
  if (!header.siblings(".clear-button").length) {
    header.after(`<button class="clear-button" data-input="${headerId}">✕</button>`);
  }

  // Öffnen/Schließen der Dropdown-Optionen
  header.on("click", function (e) {
    e.stopPropagation(); // Verhindert, dass document.click() es sofort schließt
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").not(options).slideUp(); // Schließt andere Dropdowns
    options.slideToggle();
  });
  // Filter-Logik beim Tippen (Input Suggestions)
  header.on("input", function () {
    (0,_handleEvent__WEBPACK_IMPORTED_MODULE_1__.handleEvent)();
    const searchTerm = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).val().toLowerCase();
    const visibleOptions = options.children("li").filter(function () {
      return jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text().toLowerCase().startsWith(searchTerm);
    });

    // Zeige gefilterte Optionen
    options.children("li").hide();
    visibleOptions.show();

    // "Keine Ergebnisse" anzeigen, wenn keine Treffer vorhanden sind
    if (visibleOptions.length === 0) {
      if (!options.find(".no-results").length) {
        options.append('<li class="no-results">Keine Ergebnisse gefunden</li>');
      }
    } else {
      options.find(".no-results").remove();
    }

    // Dropdown offen halten, wenn Ergebnisse vorhanden sind
    options.slideDown();
  });

  // Auswahl einer Option
  options.on("click", "li", function (e) {
    e.stopPropagation();
    header.val(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text());
    options.slideUp();
  });
}
setupDropdown("jobtitle-header", "jobtitle-options");
setupDropdown("city-header", "city-options");
// setupDropdown("category-header", "category-options");
setupDropdown("brand-header", "brand-options");
setupDropdown("department-header", "department-options");

// Event-Listener für den Löschen-Button
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("click", ".clear-button", function () {
  const inputId = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data("input");
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#" + inputId).val(""); // Leert das Input-Feld
  (0,_handleEvent__WEBPACK_IMPORTED_MODULE_1__.handleEvent)(); // Aktualisiert die Suche
});

// INPUT-SUGGESTION & LIVE-FILTERUNG FÜR ALLE DROPDOWNS
let currentFocus = -1;
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-header input").on("input", function () {
  (0,_checkParams__WEBPACK_IMPORTED_MODULE_3__.checkParams)();
  const input = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this);
  const filter = input.val().toLowerCase();
  const optionsList = input.closest(".selection-hr").find(".select-options");
  const allOptions = optionsList.find("li");
  optionsList.slideDown(); // ✅ Dropdown immer öffnen, wenn der Benutzer tippt
  currentFocus = -1; // Reset des Fokus
  allOptions.removeClass("highlighted"); // Entferne alte Hervorhebungen

  if (filter === "") {
    allOptions.show(); // ✅ Alle Optionen anzeigen, wenn das Eingabefeld leer ist
    return;
  }

  // ✅ Optionen filtern basierend auf der Eingabe
  allOptions.each(function () {
    const text = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text().toLowerCase();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).toggle(text.includes(filter)); // Zeige nur passende Optionen
  });

  // ✅ Dropdown schließen, wenn keine Optionen übrig sind
  if (optionsList.find("li:visible").length === 0) {
    optionsList.slideUp();
  }
});

//TASTATURNAVIGATION
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-header input").on("keydown", function (e) {
  const input = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this);
  const optionsList = input.closest(".selection-hr").find(".select-options");
  const allOptions = optionsList.find("li");
  const visibleOptions = optionsList.find("li:visible");
  if (e.key === "ArrowDown") {
    e.preventDefault();

    // ✅ Dropdown öffnen, wenn es geschlossen ist
    if (!optionsList.is(":visible")) {
      optionsList.slideDown();
      allOptions.show(); // Alle Optionen anzeigen, wenn noch keine Eingabe
    }
    currentFocus++;
    if (currentFocus >= visibleOptions.length) currentFocus = 0;
    highlightOption(visibleOptions.length ? visibleOptions : allOptions);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    currentFocus--;
    if (currentFocus < 0) currentFocus = visibleOptions.length - 1;
    highlightOption(visibleOptions.length ? visibleOptions : allOptions);
  } else if (e.key === "Enter") {
    e.preventDefault();
    const options = visibleOptions.length ? visibleOptions : allOptions;
    if (currentFocus > -1 && options.eq(currentFocus).length) {
      // ✅ Wenn eine Option ausgewählt ist, löse das Click-Event aus
      options.eq(currentFocus).trigger("click");
    } else {
      // ✅ Wenn KEINE Option ausgewählt ist, führe handleEvent direkt aus
      (0,_handleEvent__WEBPACK_IMPORTED_MODULE_1__.handleEvent)();
      optionsList.slideUp();
    }
  }
});

// OPTION HERVORHEBEN
function highlightOption(options) {
  options.removeClass("highlighted");
  if (currentFocus >= 0 && currentFocus < options.length) {
    options.eq(currentFocus).addClass("highlighted");
  }
}

//OPTION KLICKEN
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").on("click", "li", function () {
  const value = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text().trim();
  const input = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).closest(".selection-hr").find("input");
  input.val(value);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).closest(".select-options").slideUp(function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).find("li").removeClass("highlighted");
  });
  currentFocus = -1;
  (0,_handleEvent__WEBPACK_IMPORTED_MODULE_1__.handleEvent)();
});

//SCHLIEßEN BEI KLICK AUSSERHALB
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("click", function (e) {
  if (!jquery__WEBPACK_IMPORTED_MODULE_0___default()(e.target).closest(".selection-hr").length) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").slideUp().find("li").removeClass("highlighted");
    currentFocus = -1;
  }
});

// Event Listener for pressing enter key
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('keypress', function (e) {
  if (e.which === 13) {
    (0,_handleEvent__WEBPACK_IMPORTED_MODULE_1__.handleEvent)();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").slideUp();
  }
});

// Event Listener für Änderungen in den Input-Feldern (blur & change)
jquery__WEBPACK_IMPORTED_MODULE_0___default()("#jobtitle-header, #city-header, #brand-header", "#department-header").on("blur change", function () {
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).val().trim() !== "") {
    // Setze den Wert und stelle sicher, dass das Feld editierbar bleibt
    input.val(value).prop("readonly", false).prop("disabled", false);

    // Fokus explizit setzen, damit der Benutzer weiter tippen kann
    setTimeout(() => input.focus(), 100);
  }
});
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".select-options").on("click", "li", function () {
  const value = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).text().trim();
  const input = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).closest(".selection-hr").find("input");

  // Setze den Wert ins Input-Feld
  input.val(value);

  // Setze den Wert und stelle sicher, dass das Feld editierbar bleibt
  input.val(value).prop("readonly", false).prop("disabled", false);

  // Fokus explizit setzen, damit der Benutzer weiter tippen kann
  setTimeout(() => input.focus(), 100);
});

/***/ }),

/***/ "./assets/js/src/modules/extended-filter.js":
/*!**************************************************!*\
  !*** ./assets/js/src/modules/extended-filter.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initAccordion: function() { return /* binding */ initAccordion; },
/* harmony export */   updateFilterCount: function() { return /* binding */ updateFilterCount; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");
/* harmony import */ var _handleEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../handleEvent */ "./assets/js/src/handleEvent.js");
// assets/js/src/modules/extended-filter.js



const SINGLE_GROUPS = ['careerlevels', 'employment-type', 'joblocation-type'];

/**
 * Accordion + Badges initialisieren.
 * Erwartetes Markup:
 * #ext-filter-head, #ext-filter-cont, #arrow-cont, #filter-count
 * .badge.careerlevels / .badge.employment-type / .badge.joblocation-type / .badge.keyword
 */
function initAccordion() {
  const $head = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ext-filter-head');
  const $panel = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ext-filter-cont');
  const $arrow = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#arrow-cont');
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
  $panel.attr({
    role: 'region',
    'aria-labelledby': 'ext-filter-head'
  });
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
  $head.on('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Badges tastaturfähig
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge').attr({
    role: 'checkbox',
    tabindex: 0,
    'aria-checked': 'false'
  });

  // Delegation: Klick/Keyboard -> toggleBadge
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('click', '.badge', function () {
    toggleBadge(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this));
  });
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('keydown', '.badge', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBadge(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this));
    }
  });

  // Initial Counter anzeigen
  updateFilterCount(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#filter-count'));
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
  const gp = {
    ...((0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().globalParams || {})
  };
  if ($badge.hasClass('keyword')) {
    // Multi-Select: Keyword in CSV toggeln
    gp.keyword = toggleKeywordInCommaList(gp.keyword, name);
    const activeNow = includesKeyword(gp.keyword, name);
    $badge.toggleClass('search-active', activeNow).attr('aria-checked', String(activeNow));
  } else {
    // Single-Select: gesamte Gruppe resetten, dann ggf. setzen
    const group = SINGLE_GROUPS.find(g => $badge.hasClass(g));
    if (!group) return;
    const isAlreadyActive = $badge.hasClass('search-active') && gp[group] === name;

    // Optik-Gruppe zurücksetzen
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.badge.${group}`).removeClass('search-active').attr('aria-checked', 'false');
    if (isAlreadyActive) {
      // Deselektieren: Key entfernen
      delete gp[group];
    } else {
      // Auswählen: Key setzen
      gp[group] = name;
      $badge.addClass('search-active').attr('aria-checked', 'true');
    }
  }

  // State aktualisieren (Single Source of Truth)
  (0,_state__WEBPACK_IMPORTED_MODULE_1__.setGlobalParams)(gp);

  // Counter nur aus State berechnen
  updateFilterCount(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#filter-count'));

  // Zentrale Pipeline starten:
  // handleEvent pusht URL aus den aktuellen globalParams und ruft checkParams -> getParameter -> filterListByParams -> splittArray -> renderList
  (0,_handleEvent__WEBPACK_IMPORTED_MODULE_2__.handleEvent)((0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().globalParams);
}

/**
 * Counter ausschließlich aus globalParams.
 */
function updateFilterCount($countEl) {
  const {
    globalParams = {}
  } = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)();
  let count = 0;
  if (globalParams.careerlevels) count++;
  if (globalParams['employment-type']) count++;
  if (globalParams['joblocation-type']) count++;
  if (globalParams.keyword) {
    count += String(globalParams.keyword).split(',').map(s => s.trim()).filter(Boolean).length;
  }
  if ($countEl && $countEl.length) $countEl.text(count);
}

/* ----------------- Helpers für Keywords (CSV) ----------------- */

function includesKeyword(csv, val) {
  return String(csv || '').split(',').map(s => s.trim()).filter(Boolean).includes(val);
}
function toggleKeywordInCommaList(csv, val) {
  const arr = String(csv || '').split(',').map(s => s.trim()).filter(Boolean);
  const idx = arr.indexOf(val);
  if (idx >= 0) {
    arr.splice(idx, 1); // entfernen
  } else {
    arr.push(val); // hinzufügen
  }
  return arr.join(',');
}

/***/ }),

/***/ "./assets/js/src/modules/filters.js":
/*!******************************************!*\
  !*** ./assets/js/src/modules/filters.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   filterListByParams: function() { return /* binding */ filterListByParams; }
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");
/* harmony import */ var _pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pagination */ "./assets/js/src/modules/pagination.js");
/* harmony import */ var _dropdowns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dropdowns */ "./assets/js/src/modules/dropdowns.js");
/* harmony import */ var _messageBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./messageBox */ "./assets/js/src/modules/messageBox.js");
// assets/js/src/modules/filters.js




function filterListByParams() {
  const params = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().globalParams || {};
  const fetchedJobs = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().fetchedJobs || [];
  const out = [];
  for (const job of fetchedJobs) {
    let ok = true;
    if (params.city?.trim() && !job.city?.toLowerCase().includes(params.city.trim().toLowerCase())) ok = false;
    if (params.brand?.trim() && !job.brand?.toLowerCase().includes(params.brand.trim().toLowerCase())) ok = false;
    if (params.department?.trim() && !job.department?.toLowerCase().includes(params.department.trim().toLowerCase())) ok = false;
    if (params.jobtitle?.trim() && !job.title?.toLowerCase().includes(params.jobtitle.trim().toLowerCase())) ok = false;
    if (params.careerlevels?.trim() && !job.careerlevels?.toLowerCase().includes(params.careerlevels.trim().toLowerCase())) ok = false;
    if (params['employment-type']?.trim() && !job.employment_type?.toLowerCase().includes(params['employment-type'].trim().toLowerCase())) ok = false;
    if (params['joblocation-type']?.trim() && !job.joblocation_type?.toLowerCase().includes(params['joblocation-type'].trim().toLowerCase())) ok = false;
    if (params.keyword?.trim()) {
      const selected = params.keyword.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const jobKeywords = Array.isArray(job.keywords) ? job.keywords.map(k => String(k).toLowerCase()) : String(job.keywords || '').toLowerCase().split(',').map(s => s.trim());
      const allMatch = selected.every(kw => jobKeywords.some(jk => jk.includes(kw)));
      if (!allMatch) ok = false;
    }
    if (ok) out.push(job);
  }
  (0,_dropdowns__WEBPACK_IMPORTED_MODULE_2__.generateDropdownOptions)(out); // Update Dropdowns
  (0,_state__WEBPACK_IMPORTED_MODULE_0__.setResultJobs)(out);
  (0,_messageBox__WEBPACK_IMPORTED_MODULE_3__.message)(); // Update Message Box

  // Downstream der Pipeline:
  // - splittArray erzeugt Seiten + ruft renderList(pageArray) SELBST
  (0,_pagination__WEBPACK_IMPORTED_MODULE_1__.splittArray)();
}

/***/ }),

/***/ "./assets/js/src/modules/messageBox.js":
/*!*********************************************!*\
  !*** ./assets/js/src/modules/messageBox.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   message: function() { return /* binding */ message; },
/* harmony export */   removeShowClass: function() { return /* binding */ removeShowClass; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./assets/js/src/modules/render.js");



function message() {
  const globalParams = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().globalParams || {};
  const allJobs = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().fetchedJobs || [];
  const resultLength = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().resultJobArr.length || 0;
  console.log("globalParams in message", globalParams);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#message-container").remove();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".not-found-graphic").remove();
  let messageContainer = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div></div>");
  messageContainer.attr("id", "message-container");

  // if no hotels are found, display not found graphic
  if (resultLength === 0) {
    //clear job List
    (0,_render__WEBPACK_IMPORTED_MODULE_2__.clearJobList)();
    //hide pagination
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".portfolio-pagination").hide();
    //hide sort buttons
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".btn-sort").hide();
    //not found graphic
    let notFoundGraphic = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<img></img>");
    notFoundGraphic.attr("src", imgPath + "not-found-graphic.png");
    notFoundGraphic.attr("alt", "not found graphic");
    notFoundGraphic.attr("class", "not-found-graphic");

    // Create div with class nfg and append the img element
    let nfgDiv = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div></div>").addClass("nfg");
    nfgDiv.append(notFoundGraphic);

    // message text
    messageContainer.css({
      "background-color": "var(--awb-color5)",
      "color": "white"
    });
    messageContainer.html(`
                        <div class="message-txt red">"No Result"</div>  
                    `);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#message-wrapper").append(messageContainer);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#message-wrapper").append(nfgDiv);
  }
  // if hotels are found
  else {
    //show pagination
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".portfolio-pagination").show();
    //message text

    messageContainer.html(`
                    <div class="message-txt green">
                        <h3 id="message-headline" class="heading black">Your Selection:</h3>
                        <div class="message-filter-result">

                        <div class="result-title" id="title-jobtitle">
                            <span class="txt-black">Jobtitle:</span>
                            <span class="txt-gray">${globalParams.jobtitle || ''}</span>
                        </div>

                        <div class="result-title" id="title-country">
                            <span class="txt-black">Country:</span>
                            <span class="txt-gray">${globalParams.country || ''}</span>
                        </div>

                        <div class="result-title" id="title-city">
                            <span class="txt-black">City:</span>
                            <span class="txt-gray">${globalParams.city || ''}</span>
                        </div>

                        <div class="result-title" id="title-department">
                            <span class="txt-black">Department:</span>
                            <span class="txt-gray">${globalParams.department || ''}</span>
                        </div>

                        <div class="result-title" id="title-brand">
                            <span class="txt-black">Brand:</span>
                            <span class="txt-gray">${globalParams.brand || ''}</span>
                        </div>

                        <!-- Extended Filter -->
                        <div class="result-title" id="title-careerlevels">
                            <span class="txt-black">Careerlevel:</span>
                            <span class="txt-gray">${globalParams.careerlevels || ''}</span>
                        </div>

                        <div class="result-title" id="title-employment-type">
                            <span class="txt-black">Employment Type:</span>
                            <span class="txt-gray">${globalParams['employment-type'] || ''}</span>
                        </div>

                        <div class="result-title" id="title-joblocation-type">
                            <span class="txt-black">Joblocation Type:</span>
                            <span class="txt-gray">${globalParams['joblocation-type'] || ''}</span>
                        </div>

                        <div class="result-title" id="title-keywords">
                            <span class="txt-black">Keywords:</span>
                            <span class="txt-gray">${globalParams.keyword ? globalParams.keyword.split(',').join(', ') : ''}</span>
                        </div>

                        </div>

                        <div>
                        <p class="result-message">
                            Search resulted in <span class="txt-black">${resultLength}</span> hits.
                        </p>
                        </div>
                    </div>
                    `);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#message-wrapper").append(messageContainer);
    if (resultLength === allJobs.length) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".result-message").html(`<span class="heading black">${resultLength} offene Stellen</span>`);
    }
    updateMessageContainer();
  }
}
function updateMessageContainer() {
  const globalParams = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().globalParams || {};

  // alle .show-Klassen zurücksetzen
  removeShowClass();

  // Headline ein-/ausblenden
  if (!globalParams || Object.keys(globalParams).length === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#message-headline').css('display', 'none');
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#message-headline').css('display', '');
  }

  // Helper zum schnellen Prüfen
  const hasVal = v => v !== undefined && v !== null && String(v).trim() !== '';

  // Basis-Filter
  if (hasVal(globalParams.country) && globalParams.country !== 'Country') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-country').addClass('show');
  }
  if (hasVal(globalParams.city) && globalParams.city !== 'City') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-city').addClass('show');
  }
  if (hasVal(globalParams.brand) && globalParams.brand !== 'Brand') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-brand').addClass('show');
  }
  if (hasVal(globalParams.jobtitle) && globalParams.jobtitle !== 'jobtitle') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-jobtitle').addClass('show');
  }
  if (hasVal(globalParams.department) && globalParams.department !== 'Department') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-department').addClass('show');
  }

  // Extended-Filter
  if (hasVal(globalParams.careerlevels)) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-careerlevels').addClass('show');
  }
  if (hasVal(globalParams['employment-type'])) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-employment-type').addClass('show');
  }
  if (hasVal(globalParams['joblocation-type'])) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-joblocation-type').addClass('show');
  }
  if (hasVal(globalParams.keyword)) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#title-keywords').addClass('show');
  }
}

// remove show class from message elements
function removeShowClass() {
  // alle möglichen Titel-IDs hier aufführen
  const messageTitleIds = ['country', 'city', 'brand', 'department', 'jobtitle', 'careerlevels', 'employment-type', 'joblocation-type', 'keywords'];
  messageTitleIds.forEach(key => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#title-${key}`).removeClass('show');
  });
}

/***/ }),

/***/ "./assets/js/src/modules/pagination.js":
/*!*********************************************!*\
  !*** ./assets/js/src/modules/pagination.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   splittArray: function() { return /* binding */ splittArray; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./assets/js/src/modules/render.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");




//SPLIT RESULT TO SITE OBJECTS FOR PAGINATION
function splittArray() {
  const localResultJobArr = (0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)().resultJobArr;
  let startIdx = 0;
  let pageNumber = 1;
  const newSplittResult = [];
  while (startIdx < localResultJobArr.length) {
    let endIdx = startIdx + 6;
    let pageArray = localResultJobArr.slice(startIdx, endIdx);
    newSplittResult.push({
      pageNumber,
      pageArray
    });
    startIdx = endIdx;
    pageNumber++;
  }

  // im State speichern
  (0,_state__WEBPACK_IMPORTED_MODULE_2__.setSplittResult)(newSplittResult);

  // Pagination im State zurücksetzen
  (0,_state__WEBPACK_IMPORTED_MODULE_2__.setPagination)({
    currentPageNumber: 1,
    prevPageNumber: 0,
    nextPageNumber: 2
  });
  (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(newSplittResult[0]?.pageArray || []);
  updatePagination();
}

//UPDATE PAGINATION ELEMENTS
function updatePagination() {
  const {
    currentPageNumber,
    prevPageNumber,
    nextPageNumber,
    splittResult
  } = (0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#current-page").text(currentPageNumber);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page").text(prevPageNumber);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#next-page").text(nextPageNumber);
  if (prevPageNumber === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".pleft").css("display", "none");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page").text(" ").css("background-color", "transparent");
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".pleft").css("display", "flex");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page").css("background-color", "white");
  }
  if (nextPageNumber > splittResult.length) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".pright, #next-page").css("display", "none");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#next-page").text(" ").css("background-color", "transparent");
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".pright").css("display", "flex");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#next-page").css("background-color", "white");
  }
  if (splittResult.length < 2) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page, #next-page").css("display", "none");
  } else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page, #next-page").css("display", "block");
  }
}

//buttons pagination
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".arrow-pag").on("click", event => {
  const {
    currentPageNumber,
    splittResult
  } = (0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)();
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).hasClass("pleft")) {
    if (currentPageNumber > 1) {
      (0,_state__WEBPACK_IMPORTED_MODULE_2__.setPagination)({
        currentPageNumber: currentPageNumber - 1,
        prevPageNumber: currentPageNumber - 2,
        nextPageNumber: currentPageNumber
      });
      (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(splittResult[(0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)().currentPageNumber - 1].pageArray);
      updatePagination();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('html, body').animate({
        scrollTop: jquery__WEBPACK_IMPORTED_MODULE_0___default()('#scroll-link').offset().top
      }, 100);
    }
  } else {
    if (splittResult.length > currentPageNumber) {
      (0,_state__WEBPACK_IMPORTED_MODULE_2__.setPagination)({
        currentPageNumber: currentPageNumber + 1,
        prevPageNumber: currentPageNumber,
        nextPageNumber: currentPageNumber + 2
      });
      (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(splittResult[(0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)().currentPageNumber - 1].pageArray);
      updatePagination();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('html, body').animate({
        scrollTop: jquery__WEBPACK_IMPORTED_MODULE_0___default()('#scroll-link').offset().top
      }, 100);
    }
  }
});

/***/ }),

/***/ "./assets/js/src/modules/popup.js":
/*!****************************************!*\
  !*** ./assets/js/src/modules/popup.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   openJob: function() { return /* binding */ openJob; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom */ "./assets/js/src/dom.js");


//Open Job
function openJob(job, jobListItem) {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#current-job").removeAttr("id");
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".layer").remove();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").css("overflow", "hidden");
  jobListItem.setAttribute("id", "current-job");

  // Get the current URL
  let url = window.location.href;

  // Check if the URL already has query parameters
  let newUrl;
  if (url.indexOf('?') > -1) {
    // If parameters exist, use '&'
    newUrl = url + "&reference_id=" + job.reference_id;
  } else {
    // If no parameters, use '?'
    newUrl = url + "?reference_id=" + job.reference_id;
  }

  // Push the new URL to the history
  window.history.pushState({
    path: newUrl
  }, "", newUrl);
  renderJobDetails(job);
}

//Render Job Details
function renderJobDetails(job) {
  if (job.images_header0 == "" || job.images_header0 == null) {
    job.images_header0 = "https://www.hrg-hotels.com/hubfs/Website/_global%20assets/header/Jobportal/jobs_default_header_img.jpg";
  }
  ;

  //Create pop-up and append to clicked job
  let popUp = document.createElement("div");
  popUp.classList.add("pop-up");
  popUp.innerHTML = `
    <div class="pop-up-window">
        <span class="close" style="position: absolute; z-index: 5000;">&times;</span>
        <div class="pop-header">
          <!---  <div class="pop-logo">
            <img src="${job.brand_url}" 
            >
            </div>--->
            <div class="pop-title">
                <h3 class="heading">${job.title}</h3>
                <p class="mt-10 heading-small">${job.companyname}</p>
                <div class="pop-key-wrap">
                  <div class="key-container">
                      <p>${job.employment_type}</p>
                  </div>
                  <div class="key-container">
                      <p>${job.careerlevels}</p>
                  </div>
                  <div class="key-container">
                      <p>${job.joblocation_type}</p>
                  </div>
                  <div class="key-container">
                    <p>${job.categories}</p>
                  </div>
                </div>
            </div>

        </div>
        <div class="pop-content">
            <div class="pop-col-01">
                <div class="pop-header-image">
                  <img src="${job.images_header0}" 
                  alt="job header image" 
                  style="width: -webkit-fill-available;">
                </div>
                <div class="cont-pop description">${job.description}</div>
                <div class="cont-pop tasks">${job.tasks}</div>
                <div class="cont-pop requirement">${job.requirement_content}</div>
                <div class="cont-pop offer">${job.offer}</div>
            </div>
            <div class="pop-col-02">            
                <div class="pop-card">
                    <div class="col-1-2">
                        <div style="font-size: 12px;">
                            <div class="w-100">
                                 <img src="${imgPath}map.svg" class="icon-26" alt="map"> 
                            </div>
                            <strong>Adresseeee</strong><br>
                            <div class="color-dark-gray">
                                ${job.companyname}<br>
                                ${job.street} ${job.buildingnumber}<br>
                                ${job.postalcode} ${job.city}<br>
                                ${job.country}
                            </div>
                        </div>
                    </div>
                    <div class="col-1-2">
                        <div style="font-size: 12px;">
                        <div class="w-100">
                           <img src="${imgPath}account_circle.svg" class="icon-26" alt="circle"> 
                        </div>
                            <strong>contactPerson</strong><br>
                            ${job.recruiter_firstname} ${job.recruiter_lastname}
                        </div>
                    </div>
                </div>

                <div class="pop-card flex-col">
                    <span  class="font-12"><strong>jobOverview</strong></span>
                    <div class="row">
                        <div class="col-1-2">
                            <img src="${imgPath}work.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Scope:</span>
                            <span class="font-12"><strong>${job.categories}</strong></span>
                        </div>
                        <div class="col-1-2">
                            <img src="${imgPath}layers.svg" class="icon-26" alt="icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Level:</span>
                            <span class="font-12"><strong>${job.careerlevels}</strong></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1-2">
                            <img src="${imgPath}avg_pace.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Employment Form:</span>
                            <span class="font-12"><strong>${job.employment_type}</strong></span>
                        </div>
                        <div class="col-1-2">
                            <img src="${imgPath}location_away.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Joblocation Type:</span>
                            <span class="font-12"><strong>${job.joblocation_type}</strong></span>
                        </div>
                    </div>
                </div> 
                <div class="pop-card border-top flex-col">
                    <div class="row">
                        <span class="font-12"><strong>Follow us</strong></span>
                    </div>
                    <div class="row">
                        <a href="https://www.linkedin.com/company/hotels-by-hr-gmbh/mycompany/" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_linkedin.png" class="icon-20" alt="icon linkedIn">
                        </a>
                        <a href="https://www.xing.com/pages/hrghotelsgmbh" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_xing.png" class="icon-20" alt="icon xing">
                        </a>
                        <a href="https://www.facebook.com/HRGroup.Hotels" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_facebook.png" class="icon-20" alt="icon facebook">
                        </a>
                        <a href="https://www.youtube.com/channel/UCUP45iVsv0K4ie7u5BqY_PQ" target=“_blank“ rel=“noopener“ class="btn-social" >
                           <img src="${imgPath}icon_youtube.png" class="icon-20" alt="icon youtube">
                        </a>
                        <a href="https://www.instagram.com/hrg.community/" target=“_blank“ rel=“noopener“ class="btn-social" >
                          <img src="${imgPath}icon_insta.png" class="icon-20" alt="icon instagram">
                       </a>
                       <a href="https://www.tiktok.com/@hrg.hotels" target=“_blank“ rel=“noopener“ class="btn-social" >
                          <img src="${imgPath}icon_tiktok.png" class="icon-20" alt="icon tiktok">
                        </a>
                    </div>
                    
                    <div class="row">
                      <div class="apply-btn-wrap">
                        <div class="apply-item">
                          <a class="btn btn-apply m-b-0" target="_blank" rel="noopener nofollow" href="">apply!</a>
                        </div>
                        <div class="apply-item">
                          <a href="https://of-hrg-hotels.pitchyou.de/go/${job.reference_id}" target=“_blank“ rel=“noopener“>
                            <img src="${imgPath}icon_whatsapp.png" class="whatsapp-icon" alt="icon">
                          </a>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>   
        <div class="row">
        <div class="btn-bottom-desktop">

        </div>
    </div>
    </div>
    `;
  //append to current job
  let currentEl = document.getElementById("current-job");
  currentEl.appendChild(popUp);
  popUp.style.display = "block";

  //Create layer and append to body
  let layer = document.createElement("div");
  layer.classList.add("layer");
  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.getRenderHook)().appendChild(layer);

  // Close-Funktion
  function closePopup() {
    const url = window.location.href;
    const newUrl = url.split("&reference_id")[0];
    window.history.pushState({
      path: newUrl
    }, "", newUrl);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".pop-up").remove();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(currentEl).removeAttr("id");
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(".layer").remove();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("body").css("overflow", "auto");
  }

  // Layer-Klick -> schließen
  layer.addEventListener("click", closePopup);

  // *** WICHTIG: Listener am Popup-Element suchen ***
  const closeBtn = popUp.querySelector(".close");
  if (closeBtn) {
    closeBtn.style.cssText += "top:8px;right:8px;cursor:pointer;"; // optional
    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      closePopup();
    });
  }
}

/***/ }),

/***/ "./assets/js/src/modules/render.js":
/*!*****************************************!*\
  !*** ./assets/js/src/modules/render.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearJobList: function() { return /* binding */ clearJobList; },
/* harmony export */   renderList: function() { return /* binding */ renderList; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom */ "./assets/js/src/dom.js");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popup */ "./assets/js/src/modules/popup.js");
// assets/js/src/modules/render.js



(0,_dom__WEBPACK_IMPORTED_MODULE_1__.initDom)();
let hook = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.getRenderHook)();
function clearJobList() {
  if (!hook) return;
  hook.innerHTML = '';
}

/**
 * Rendert die übergebene Seite (Array von Jobs).
 * KEIN State-Read hier; die Seite kommt aus pagination.splittArray().
 */
function renderList(list = []) {
  if (!hook) return;
  clearJobList();
  if (!Array.isArray(list) || list.length === 0) return;
  for (let job of list) {
    const jobItem = document.createElement('div');
    jobItem.classList.add('job-list-item');
    jobItem.innerHTML = `
      <div class="job-header">
        <h3 class="heading">${job.title ?? ''}</h3>
      </div>
      <div class="company-list-item">
        <div class="comp-col2">
          <div class="card-jp-icons">
            <img src="${imgPath}rh-logo.png" alt="logo" class="search-icon list-loc-icon">
          </div>
          <h4 class="heading-small">${job.companyname ?? ''}</h4>
          <div class="card-jp-icons">
            <img src="${imgPath}location_on.svg" alt="icon location" class="search-icon list-loc-icon">
            <p class="line-hight-160 pd-cit">${job.city ?? ''}, ${job.city ?? ''}</p>
          </div>
        </div>
      </div>
      <div class="key-row">
        <div class="key-container"><p>${job.city ?? ''}, ${job.country ?? ''}</p></div>
        <div class="key-container"><p>${job.careerlevels ?? ''}</p></div>
        <div class="key-container"><p>${job.employment_type ?? ''}</p></div>
        <div class="key-container"><p>${job.joblocation_type ?? ''}</p></div>
        <div class="key-container"><p>${job.categories ?? ''}</p></div>
      </div>
    `;
    jobItem.addEventListener('click', () => (0,_popup__WEBPACK_IMPORTED_MODULE_2__.openJob)(job, jobItem));
    hook.appendChild(jobItem);
  }
}

/***/ }),

/***/ "./assets/js/src/pushArgToURL.js":
/*!***************************************!*\
  !*** ./assets/js/src/pushArgToURL.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pushArgToURL: function() { return /* binding */ pushArgToURL; }
/* harmony export */ });
/* harmony import */ var _checkParams__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkParams */ "./assets/js/src/checkParams.js");

function pushArgToURL(argObj) {
  // Entferne das `#` aus der Basis-URL
  let baseUrl = window.location.href.split("?")[0].split("#")[0];
  let queryString = Object.keys(argObj).map(key => key + "=" + encodeURIComponent(argObj[key])).join("&");
  let url = baseUrl;
  if (queryString) {
    url += "?" + queryString;
  }
  window.history.pushState({
    path: url
  }, "", url);

  // pull parameters from URL and call filterListByParams
  (0,_checkParams__WEBPACK_IMPORTED_MODULE_0__.checkParams)();
}

/***/ }),

/***/ "./assets/js/src/state.js":
/*!********************************!*\
  !*** ./assets/js/src/state.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getState: function() { return /* binding */ getState; },
/* harmony export */   setFetchedJobs: function() { return /* binding */ setFetchedJobs; },
/* harmony export */   setGlobalParams: function() { return /* binding */ setGlobalParams; },
/* harmony export */   setPagination: function() { return /* binding */ setPagination; },
/* harmony export */   setResultJobs: function() { return /* binding */ setResultJobs; },
/* harmony export */   setSplittResult: function() { return /* binding */ setSplittResult; }
/* harmony export */ });
// assets/js/src/state.js

const state = {
  fetchedJobs: [],
  resultJobArr: [],
  urlParams: "",
  globalParams: {},
  selections: {
    city: "",
    jobtitle: "",
    brand: "",
    department: ""
  },
  currentPageNumber: 1,
  prevPageNumber: 0,
  nextPageNumber: 2,
  splittResult: []
};

// Getter
const getState = () => state;

// Setter
const setFetchedJobs = list => {
  state.fetchedJobs = Array.isArray(list) ? list : [];
};
const setResultJobs = list => {
  state.resultJobArr = Array.isArray(list) ? [...list] : [];
};
const setSplittResult = list => {
  state.splittResult = Array.isArray(list) ? [...list] : [];
};
const setGlobalParams = obj => {
  state.globalParams = obj || {};
};
const setPagination = patch => {
  state.currentPageNumber = patch.currentPageNumber ?? state.currentPageNumber;
  state.prevPageNumber = patch.prevPageNumber ?? state.prevPageNumber;
  state.nextPageNumber = patch.nextPageNumber ?? state.nextPageNumber;
};

/***/ }),

/***/ "./assets/js/src/ui-helper.js":
/*!************************************!*\
  !*** ./assets/js/src/ui-helper.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initUIHelpers: function() { return /* binding */ initUIHelpers; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./assets/js/src/state.js");
/* harmony import */ var _modules_messageBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/messageBox */ "./assets/js/src/modules/messageBox.js");
/* harmony import */ var _modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/extended-filter */ "./assets/js/src/modules/extended-filter.js");
/* harmony import */ var _handleEvent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handleEvent */ "./assets/js/src/handleEvent.js");






/**
 * Bindet UI-Helfer wie den Reset-Button.
 * Aufruf in main.js nach DOMContentLoaded.
 */
function initUIHelpers() {
  bindResetButton();
}
function bindResetButton() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off('click.ui-reset', '#btn-reset'); // doppelte Bindungen vermeiden
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('click.ui-reset', '#btn-reset', function () {
    // 1) Message-Tags zurücksetzen & Not-Found-Graphic entfernen
    (0,_modules_messageBox__WEBPACK_IMPORTED_MODULE_2__.removeShowClass)();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.nfg').remove();

    // 2) Inputs und Optionen zurücksetzen
    const filters = [{
      id: 'jobtitle',
      placeholder: 'Jobtitle'
    }, {
      id: 'city',
      placeholder: 'city'
    }, {
      id: 'country',
      placeholder: 'country'
    }, {
      id: 'brand',
      placeholder: 'brand'
    }, {
      id: 'department',
      placeholder: 'Department'
    }];
    filters.forEach(({
      id,
      placeholder
    }) => {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${id}-header`).val('').attr('placeholder', placeholder);
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${id}-options li`).show();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.selection-hr input[name="${id.replace('-', ' ')}"]`).val('');
    });

    // 3) Alle Badges (Extended Filter) zurücksetzen (Optik + ARIA)
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.badge').removeClass('search-active').attr('aria-checked', 'false');

    // 4) State leeren (Single source of truth)
    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setGlobalParams)({});

    // 5) Zähler aktualisieren (nur aus State)
    (0,_modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__.updateFilterCount)(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#filter-count'));

    // 6) Pipeline starten:
    //    'replace' → nur das (leere) Objekt verwenden, Inputs ignorieren,
    //    pushArgToURL löscht damit alle bekannten Keys aus der URL.
    (0,_handleEvent__WEBPACK_IMPORTED_MODULE_4__.handleEvent)({}, 'replace');
  });
}

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!*******************************!*\
  !*** ./assets/js/src/main.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./assets/js/src/state.js");
/* harmony import */ var _checkParams__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkParams */ "./assets/js/src/checkParams.js");
/* harmony import */ var _modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/extended-filter */ "./assets/js/src/modules/extended-filter.js");
/* harmony import */ var _ui_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui-helper */ "./assets/js/src/ui-helper.js");
/* harmony import */ var _css_src_index_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../css/src/index.css */ "./assets/css/src/index.css");
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");






(function ($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    (0,_modules_extended_filter__WEBPACK_IMPORTED_MODULE_3__.initAccordion)();
    (0,_ui_helper__WEBPACK_IMPORTED_MODULE_4__.initUIHelpers)();
    $('#extended-filter').insertBefore('#message-wrapper');

    // Prüfen, ob "/de/" in der URL enthalten ist
    const lang = window.location.pathname.includes('/de/') ? 'de' : 'en';
    fetch(jobPortal.ajaxurl + `?action=jobportal_fetch&lang=${lang}`).then(response => {
      if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
      return response.json();
    }).then(data => {
      if (data.success) {
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.setFetchedJobs)(data.data);
        (0,_checkParams__WEBPACK_IMPORTED_MODULE_2__.checkParams)();
      } else {
        console.error("Fehler beim Abrufen der Job-Daten:", data);
      }
    }).catch(error => console.error("Fetch-Fehler:", error));
  });
})(jQuery);
}();
/******/ })()
;
//# sourceMappingURL=jobportal.bundle.js.map