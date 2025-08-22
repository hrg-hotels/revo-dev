/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
  const {
    fetchedJobs: resJobArr
  } = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)();
  https:
  //pullman-stuttgart.com/

  if (!urlParams.toString()) {
    // Arbeitsarray = Kopie der Originaldaten
    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setResultJobs)(resJobArr);
    (0,_state__WEBPACK_IMPORTED_MODULE_0__.setGlobalParams)({});
    (0,_modules_dropdowns__WEBPACK_IMPORTED_MODULE_1__.generateDropdownOptions)(resJobArr);
    (0,_modules_pagination__WEBPACK_IMPORTED_MODULE_2__.splittArray)(resJobArr);
    (0,_modules_messageBox__WEBPACK_IMPORTED_MODULE_3__.message)(resJobArr.length);
    console.log('No URL parameters found');
  } else {
    (0,_getParameter__WEBPACK_IMPORTED_MODULE_4__.getParameter)();
    console.log('URL parameters found');
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
/* harmony export */   getRenderHook: function() { return /* binding */ getRenderHook; },
/* harmony export */   initDom: function() { return /* binding */ initDom; }
/* harmony export */ });
const dom = {
  renderHook: null
};
function initDom() {
  dom.renderHook = document.getElementById("jobportal-container");
}
function getRenderHook() {
  return dom.renderHook;
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
/* harmony import */ var _modules_filters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/filters */ "./assets/js/src/modules/filters.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "./assets/js/src/state.js");



function getParameter() {
  let params = {};
  let urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  console.log("params", params);

  // Map between URL param names and input names
  if (params.jobtitle || params.country || params.city || params.brand || params.department) {
    // Set the values using input[name=...]
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="jobtitle"]').val(params.jobtitle || '');
    //$('.selection-hr input[name="country"]').val(params.country || '');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="city"]').val(params.city || '');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="brand"]').val(params.brand || '');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.selection-hr input[name="department"]').val(params.department || '');
  }
  (0,_state__WEBPACK_IMPORTED_MODULE_2__.setGlobalParams)(params);
  console.log("globalParams", (0,_state__WEBPACK_IMPORTED_MODULE_2__.getState)().globalParams);
  (0,_modules_filters__WEBPACK_IMPORTED_MODULE_1__.filterListByParams)();
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


function handleEvent() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".nfg").remove();
  let argObj = {};
  let jobtitle = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#jobtitle-header").val().trim();
  let city = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#city-header").val().trim();
  let department = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#department-header").val().trim();
  let brand = jquery__WEBPACK_IMPORTED_MODULE_0___default()("#brand-header").val().trim();
  if (jobtitle !== "" && jobtitle !== undefined) {
    argObj["jobtitle"] = jobtitle;
  }
  if (brand !== "" && brand !== undefined) {
    argObj["brand"] = brand;
  }
  if (city !== "" && city !== undefined) {
    argObj["city"] = city;
  }
  if (department !== "" && department !== undefined) {
    argObj["department"] = department;
  }
  // 🔹 URL aktualisieren
  (0,_pushArgToURL__WEBPACK_IMPORTED_MODULE_1__.pushArgToURL)(argObj);
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




function generateDropdownOptions(resultJobArr) {
  const getUniqueSortedValues = key => {
    return [...new Set(resultJobArr.map(h => h[key]).filter(Boolean))].sort();
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
  // populateDropdown("category-options", category);
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
  header.click(function (e) {
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
  (0,_state__WEBPACK_IMPORTED_MODULE_2__.setResultJobs)([]);
  window.history.pushState({}, document.title, window.location.pathname);
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
      // ✅ Wenn eine Option ausgewählt ist, wähle sie aus
      options.eq(currentFocus).click();
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

//************RESET FUNCTION******************************/
jquery__WEBPACK_IMPORTED_MODULE_0___default()("#btn-reset").click(function () {
  removeShowClass();
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(".nfg").remove(); // Entfernt Elemente mit Klasse "nfg"
  window.history.pushState({}, document.title, window.location.pathname); // Entfernt URL-Parameter

  // Felder zurücksetzen
  const filters = [{
    id: "jobtitle",
    placeholder: "Jobtitle"
  }, {
    id: "city",
    placeholder: "city"
  }, {
    id: "country",
    placeholder: "country"
  }, {
    id: "brand",
    placeholder: "brand"
  }, {
    id: "department",
    placeholder: "Department"
  }];
  filters.forEach(({
    id,
    placeholder
  }) => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${id}-header`).val("").attr("placeholder", placeholder);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#${id}-options li`).show();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`.selection-hr input[name="${id.replace("-", " ")}"]`).val("");
  });
  (0,_checkParams__WEBPACK_IMPORTED_MODULE_3__.checkParams)(); // Jobliste aktualisieren
});

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




function filterListByParams() {
  const params = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().globalParams;
  (0,_state__WEBPACK_IMPORTED_MODULE_0__.setResultJobs)([]);
  console.log("Filtering jobs with params:", params);
  const fetchedJobs = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().fetchedJobs;
  console.log("Fetched jobs:", fetchedJobs);
  for (let job of fetchedJobs) {
    let matchesJobs = true;
    if (params.city?.trim().toLowerCase()) {
      if (!job.city?.toLowerCase().includes(params.city.trim().toLowerCase())) {
        matchesJobs = false;
      }
    }
    if (params.brand?.trim().toLowerCase()) {
      if (!job.brand?.toLowerCase().includes(params.brand.trim().toLowerCase())) {
        matchesJobs = false;
      }
    }
    if (params.department?.trim().toLowerCase()) {
      if (!job.department?.toLowerCase().includes(params.department.trim().toLowerCase())) {
        matchesJobs = false;
      }
    }
    if (params.jobtitle?.trim().toLowerCase()) {
      if (!job.title?.toLowerCase().includes(params.jobtitle.trim().toLowerCase())) {
        matchesJobs = false;
      }
    }
    if (matchesJobs) {
      (0,_state__WEBPACK_IMPORTED_MODULE_0__.setResultJobs)(job);
      console.log("Job matches:", job);
    }
  }
  let resultJobArr = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getState)().resultJobArr;
  console.log("Filtered jobs:", resultJobArr);
  (0,_messageBox__WEBPACK_IMPORTED_MODULE_3__.message)(resultJobArr.length);
  if (resultJobArr.length > 0) {
    (0,_pagination__WEBPACK_IMPORTED_MODULE_1__.splittArray)(resultJobArr);
    (0,_dropdowns__WEBPACK_IMPORTED_MODULE_2__.generateDropdownOptions)(resultJobArr);
  } else {
    window.history.pushState({}, document.title, window.location.pathname);
  }
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
/* harmony export */   removeShowClass: function() { return /* binding */ removeShowClass; },
/* harmony export */   updateMessageContainer: function() { return /* binding */ updateMessageContainer; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state */ "./assets/js/src/state.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./assets/js/src/modules/render.js");



const globalParams = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().globalParams;
const allJobs = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().fetchedJobs;
function message(resultLength) {
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
                            <h4 id="message-headline">"Your Selection": </h4>
                            <div class="message-filter-result">
                                <div class="result-title" id="title-jobtitle"><span class="txt-black">"Jobtitle":</span><span class="txt-gray"> ${globalParams.jobtitle}</span></div>
                                <div class="result-title" id="title-country"><span class="txt-black">"country":</span><span class="txt-gray"> ${globalParams.country}</span></div>
                                <div class="result-title" id="title-city"><span class="txt-black">"city":</span><span class="txt-gray"> ${globalParams.city}</span></div>
                                <div class="result-title" id="title-department"><span class="txt-black">"Department":</span><span class="txt-gray"> ${globalParams.department}</span></div>
                                <div class="result-title" id="title-brand"><span class="txt-black">"Brand":</span><span class="txt-gray"> ${globalParams.brand}</span></div>
                            </div>
                            <div><p class="result-message">"search resulted" <span class="txt-black"> ${resultLength} </span>"hits".</p></div>
                            </div>          
                        `);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#message-wrapper").append(messageContainer);
    if (resultLength === allJobs.length) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".result-message").html(`<span class="txt-black">Hotels:</span> ${resultLength}`);
    }
    updateMessageContainer();
  }
}
//update message container
function updateMessageContainer() {
  //remove show class from message elements
  removeShowClass();
  if (Object.keys(globalParams).length === 0) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#message-headline').css('display', 'none');
  }
  if (globalParams.country && globalParams.country !== "" && globalParams.country !== 'Country') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#title-country").addClass("show");
  }
  if (globalParams.city && globalParams.city !== "" && globalParams.city !== 'City') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#title-city").addClass("show");
  }
  if (globalParams.brand && globalParams.brand !== "" && globalParams.brand !== 'Brand') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#title-brand").addClass("show");
  }
  if (globalParams.jobtitle && globalParams.jobtitle !== "" && globalParams.jobtitle !== 'jobtitle') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#title-jobtitle").addClass("show");
  }
  if (globalParams.department && globalParams.department !== "" && globalParams.department !== 'Department') {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#title-department").addClass("show");
  }
}
//remove show class from message elements
function removeShowClass() {
  let messageTitleArray = ['country', 'city', 'brand', 'department', 'jobtitle'];
  messageTitleArray.forEach(element => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(`#title-${element}`).removeClass("show");
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
/* harmony export */   splittArray: function() { return /* binding */ splittArray; },
/* harmony export */   updatePagination: function() { return /* binding */ updatePagination; }
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./assets/js/src/modules/render.js");


let splittResult = [];
let current = 1;
let prev = 0;
let next = 2;
let currentPageNumber = 1;
let prevPageNumber = 0;
let nextPageNumber = 2;
//SPLIT RESULT TO SITE OBJECTS FOR PAGINATION
function splittArray(resOrigin) {
  splittResult = [];
  currentPageNumber = 1;
  prevPageNumber = 0;
  nextPageNumber = 2;
  let startIdx = 0;
  let pageNumber = 1;
  while (startIdx < resOrigin.length) {
    let endIdx = startIdx + 6;
    let pageArray = resOrigin.slice(startIdx, endIdx);
    splittResult.push({
      pageNumber,
      pageArray
    });
    startIdx = endIdx;
    pageNumber++;
  }
  (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(splittResult[0].pageArray);
  updatePagination();
  // updateMapViewBtn();
  console.log("splittResult", splittResult);
}
//UPDATE PAGINATION ELEMENTS
function updatePagination() {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#current-page").text(currentPageNumber);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#prev-page").text(prevPageNumber);
  jquery__WEBPACK_IMPORTED_MODULE_0___default()("#next-page").text(nextPageNumber);
  if (prevPageNumber == 0) {
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
jquery__WEBPACK_IMPORTED_MODULE_0___default()(".arrow-pag").click(event => {
  //left arrow
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(event.currentTarget).hasClass("pleft")) {
    if (currentPageNumber > 1) {
      currentPageNumber--;
      prevPageNumber = currentPageNumber - 1;
      nextPageNumber = currentPageNumber + 1;
      (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(splittResult[currentPageNumber - 1].pageArray);
      updatePagination();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('html, body').animate({
        scrollTop: jquery__WEBPACK_IMPORTED_MODULE_0___default()('#scroll-link').offset().top
      }, 100);
    } else {
      return;
    }
  }
  //right arrow
  else {
    if (splittResult.length > currentPageNumber) {
      currentPageNumber++;
      prevPageNumber = currentPageNumber - 1;
      nextPageNumber = currentPageNumber + 1;
      (0,_render__WEBPACK_IMPORTED_MODULE_1__.renderList)(splittResult[currentPageNumber - 1].pageArray);
      updatePagination();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('html, body').animate({
        scrollTop: jquery__WEBPACK_IMPORTED_MODULE_0___default()('#scroll-link').offset().top
      }, 100);
    } else {
      return;
    }
  }
});

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
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom */ "./assets/js/src/dom.js");
// assets/js/src/modules/render.js

function clearJobList() {
  const hook = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.getRenderHook)();
  if (!hook) return;
  hook.innerHTML = "";
}
function renderList(resultJobArr) {
  //remove old job list
  clearJobList();
  const hook = document.getElementById("jobportal-container");
  for (let job of resultJobArr) {
    let jobItem = document.createElement("div");
    jobItem.classList.add("job-list-item");
    jobItem.innerHTML = `
                        <div class="job-header">
                            <h3>${job.title}</h3>
                        </div>
                        <div class="company-list-item">
                            <div class="comp-col2">
                                <p class="line-hight-160"><strong>${job.companyname}</strong></p>
                                <div class="item-location">
                                    <img src="${imgPath}location_on.svg" alt="icon location" class="search-icon list-loc-icon">
                                    <p class="line-hight-160 pd-cit">${job.city}, ${job.city}</p>
                                </div>
                            </div>
                        </div>
                        <div class="key-row">
                            <div class="key-container">
                                <p>${job.city}, ${job.country}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.careerlevels}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.employment_type}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.joblocation_type}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.categories}</p>
                            </div>
                        </div>
                        <button class="det-btn btn btn-card btn-job">
                        <img src="${imgPath}arrow_black.svg" alt="arrow">
                        </button> 
                      `;
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
/* harmony export */   setResultJobs: function() { return /* binding */ setResultJobs; }
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
  }
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
const setGlobalParams = obj => {
  state.globalParams = obj || {};
};
const setPagination = patch => {
  state.pagination = {
    ...state.pagination,
    ...patch
  };
};

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



(function ($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Prüfen, ob "/de/" in der URL enthalten ist
    const lang = window.location.pathname.includes('/de/') ? 'de' : 'en';
    fetch(jobPortal.ajaxurl + `?action=jobportal_fetch&lang=${lang}`).then(response => {
      if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
      return response.json();
    }).then(data => {
      if (data.success) {
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.setFetchedJobs)(data.data);
        console.log('Fetched Jobs:', (0,_state__WEBPACK_IMPORTED_MODULE_1__.getState)().fetchedJobs);
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