(function($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Prüfen, ob "/de/" in der URL enthalten ist
    const lang = window.location.pathname.includes('/de/') ? 'de' : 'en';

    fetch(hotelPortfolio.ajaxurl + `?action=hotel_portfolio_fetch&lang=${lang}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
     // ****** GLOBAL VARIABLES AND FUNCTIONS *************//
     let fetchedHotels = data.data;
     console.log("fetchedHotels", fetchedHotels);
 
     let resultHotelArr = [];
     let renderHook = document.getElementById("hotel-portfolio-container");
     let urlParams = "";
     let globalParams = {};
 
     // Variables for dataValue in input fields
     let selectedCity = "";
     let selectedCountry = "";
     let selectedBrand = "";
     let selectedParentBrand = "";
 
     // Variables for pagination
     let splittResult = [];
     let currentPageNumber = 1;
     let prevPageNumber = 0;
     let nextPageNumber = 2;

                // Functions to clear and reset values
                function clearHotelList() {
                    renderHook.innerHTML = "";
                }

  /*************Filter**************************************************/                
                //Dropdown-Werte setzen
                function generateDropdownOptions(resultHotelArr) {
                  const getUniqueSortedValues = (keys) => {
                      return [...new Set(
                          resultHotelArr
                              .flatMap(h => keys.map(key => h[key])) // Collect values from both keys
                              .filter(Boolean) // Remove undefined or null values
                              .map(v => v.trim()) // Remove extra spaces
                      )].sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
                  };
              
                  // Collecting unique values for dropdowns
                  const countries = getUniqueSortedValues(['country']);
                  const cities = getUniqueSortedValues(['city', 'county_town']); // Includes both city and county_town
                  const brand = getUniqueSortedValues(['brand']);
                  const parentBrand = getUniqueSortedValues(['parent_brand']);
              
                  const populateDropdown = (id, values) => {
                      const dropdown = document.getElementById(id);
                      if (!dropdown) {
                          console.warn(`Dropdown with ID "${id}" not found.`);
                          return;
                      }
              
                      dropdown.innerHTML = values
                          .map(v => `<li data-value="${v}">${v}</li>`)
                          .join('');
                  };
              
                  // Populating Dropdowns
                  populateDropdown("country-options", countries);
                  populateDropdown("city-options", cities);
                  populateDropdown("brand-options", brand);
                  populateDropdown("parent-brand-options", parentBrand);
              }
              

                // Verstecke die Dropdown-Optionen initial
                $(".select-options").hide(); 

                function setupDropdown(headerId, optionsId) {
                    const header = $("#" + headerId);
                    const options = $("#" + optionsId);

                    // Falls der Clear-Button noch nicht existiert, füge ihn hinzu
                      if (!header.siblings(".clear-button").length) {
                        header.after(`<button class="clear-button" data-input="${headerId}">✕</button>`);
                    }

                    // Öffnen/Schließen der Dropdown-Optionen
                    header.click(function (e) {
                        e.stopPropagation(); // Verhindert, dass document.click() es sofort schließt
                        $(".select-options").not(options).slideUp(); // Schließt andere Dropdowns
                        options.slideToggle();
                    });
                    // Filter-Logik beim Tippen (Input Suggestions)
                      header.on("input", function () {
                        handleEvent();
                        const searchTerm = $(this).val().toLowerCase();
                        const visibleOptions = options.children("li").filter(function () {
                          return $(this).text().toLowerCase().startsWith(searchTerm);
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

                    // In jedem Fall: Dropdown offen halten
                    options.stop(true, true).slideDown();
                            });


                    // Auswahl einer Option
                    options.on("click", "li", function (e) {
                        e.stopPropagation(); 
                        header.val($(this).text());
                        options.slideUp();
                    });
                }
                // Event-Listener für den Löschen-Button
                $(document).on("click", ".clear-button", function () {
                  const inputId = $(this).data("input");
                  $("#" + inputId).val(""); // Leert das Input-Feld
                  handleEvent(); // Aktualisiert die Suche
                });

                // INPUT-SUGGESTION & LIVE-FILTERUNG FÜR ALLE DROPDOWNS
                // Globale Variable für den aktuellen Fokus
                let currentFocus = -1;
                $(".select-header input").on("input", function () {
                  resultHotelArr = [];
                  window.history.pushState({}, document.title, window.location.pathname);
                  checkParams();
                
                  const input = $(this);
                  let rawValue = input.val();
                
                  // Bereinigung: HTML, Zahlen, Sonderzeichen entfernen
                  rawValue = rawValue.replace(/<[^>]*>/g, '');
                  rawValue = rawValue.replace(/\d+/g, '');
                  rawValue = rawValue.replace(/[^a-zA-ZäöüÄÖÜß\s]/g, '');
                  rawValue = rawValue.replace(/\s+/g, ' ').trim();
                
                  input.val(rawValue);
                
                  const filter = rawValue.toLowerCase();
                
                  const optionsList = input.closest(".selection-hr").find(".select-options");
                  const allOptions = optionsList.find("li");
                
                  optionsList.slideDown();
                  currentFocus = -1;
                  allOptions.removeClass("highlighted");
                
                  if (filter === "") {
                    allOptions.show();
                    return;
                  }
                
                  allOptions.each(function () {
                    const text = $(this).text().toLowerCase();
                    $(this).toggle(text.includes(filter));
                  });
                
                  if (optionsList.find("li:visible").length === 0) {
                    optionsList.slideUp();
                  }
                });

                //TASTATURNAVIGATION
                $(".select-header input").on("keydown", function (e) {
                  const input = $(this);
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
                  } 
                  else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      currentFocus--;
                      if (currentFocus < 0) currentFocus = visibleOptions.length - 1;
                      highlightOption(visibleOptions.length ? visibleOptions : allOptions);
                  } 
                  else if (e.key === "Enter") {
                      e.preventDefault();
                      const options = visibleOptions.length ? visibleOptions : allOptions;

                      if (currentFocus > -1 && options.eq(currentFocus).length) {
                          // ✅ Wenn eine Option ausgewählt ist, wähle sie aus
                          options.eq(currentFocus).click();
                      } else {
                          // ✅ Wenn KEINE Option ausgewählt ist, führe handleEvent direkt aus
                          handleEvent();
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
                $(".select-options").on("click", "li", function () {
                    const value = $(this).text().trim();
                    const input = $(this).closest(".selection-hr").find("input");

                    input.val(value);
                    $(this).closest(".select-options").slideUp(function () {
                        $(this).find("li").removeClass("highlighted");
                    });

                    currentFocus = -1;
                    handleEvent();
                });

                //SCHLIEßEN BEI KLICK AUSSERHALB
                $(document).on("click", function (e) {
                    if (!$(e.target).closest(".selection-hr").length) {
                        $(".select-options").slideUp().find("li").removeClass("highlighted");
                        currentFocus = -1;
                    }
                });

                // Event Listener for pressing enter key
                $(document).on('keypress', function (e) {
                  if (e.which === 13) {
                    handleEvent();
                      $(".select-options").slideUp();
                  }
                });

                // Event Listener für Änderungen in den Input-Feldern (blur & change)
                $("#country-header, #city-header, #brand-header","#parent-brand-header")
                  .on("blur change", function () {
                    if ($(this).val().trim() !== "") {
                    // Setze den Wert und stelle sicher, dass das Feld editierbar bleibt
                    input.val(value).prop("readonly", false).prop("disabled", false);

                    // Fokus explizit setzen, damit der Benutzer weiter tippen kann
                    setTimeout(() => input.focus(), 100);
                    }
                  });
                  $(".select-options").on("click", "li", function () {            
                    const value = $(this).text().trim();
                    const input = $(this).closest(".selection-hr").find("input");
                
                    // Setze den Wert ins Input-Feld
                    input.val(value);
                
                    // Setze den Wert und stelle sicher, dass das Feld editierbar bleibt
                    input.val(value).prop("readonly", false).prop("disabled", false);

                    // Fokus explizit setzen, damit der Benutzer weiter tippen kann
                    setTimeout(() => input.focus(), 100);
                });

                // Initialisiere die Dropdowns
                setupDropdown("country-header", "country-options");
                setupDropdown("city-header", "city-options");
                setupDropdown("brand-header", "brand-options");
                setupDropdown("parent-brand-header", "parent-brand-options");
        
//************RESET FUNCTION******************************/
                $("#btn-reset").click(function () {
                  removeShowClass();
                  $(".nfg").remove(); // Entfernt Elemente mit Klasse "nfg"
                  window.history.pushState({}, document.title, window.location.pathname); // Entfernt URL-Parameter

                  // Felder zurücksetzen
                  const filters = [
                      { id: "city", placeholder: hotelFilterTranslations.city },
                      { id: "country", placeholder: hotelFilterTranslations.country },
                      { id: "brand", placeholder: hotelFilterTranslations.brand },
                      { id: "parent-brand", placeholder: "Franchise Partner" }
                  ];

                  filters.forEach(({ id, placeholder }) => {
                      $(`#${id}-header`).val("").attr("placeholder", placeholder);
                      $(`#${id}-options li`).show();
                      $(`.selection-hr input[name="${id.replace("-", " ")}"]`).val("");
                  });

                  checkParams(); // Jobliste aktualisieren
                });
      
  //**********SEARCH FUNCTION******************************/
                    function handleEvent() {

                      $(".nfg").remove();

                      let argObj = {};

                      let country = $("#country-header").val().trim();
                      let city = $("#city-header").val().trim();
                      let parentBrand = $("#parent-brand-header").val().trim();
                      let brand = $("#brand-header").val().trim();

                      if (parentBrand !== "" && parentBrand !== undefined) {
                          argObj["parent_brand"] = parentBrand;
                      }

                      if (brand !== "" && brand !== undefined) {
                          argObj["brand"] = brand;
                      }

                      if (country !== "" && country !== undefined) {
                          argObj["country"] = country;
                      }

                      if (city !== "" && city !== "all locations" && city !== undefined) {
                          argObj["city"] = city;
                      }

                      // 🔹 URL aktualisieren
                      pushArgToURL(argObj);
                  }

  //*************PUSH ARGUMENTS TO URL***********/
                  function pushArgToURL(argObj) {
         
                    // Entferne das `#` aus der Basis-URL
                    let baseUrl = window.location.href.split("?")[0].split("#")[0];
                  
                    let queryString = Object.keys(argObj)
                      .map((key) => key + "=" + encodeURIComponent(argObj[key]))
                      .join("&");
                  
                    let url = baseUrl;
                    if (queryString) {
                      url += "?" + queryString;
                    }
                  
                    window.history.pushState({ path: url }, "", url);
                    
                    // pull parameters from URL and call filterListByParams
                    checkParams();
                  }
  
  //*************MESSAGE CONTAINER/ERROR MESSAGE ***********/
                function message(resultLength) {
                  
                  $("#message-container").remove();
                  $(".not-found-graphic").remove();

                  let messageContainer = $("<div></div>");
                  messageContainer.attr("id", "message-container");

                  // if no hotels are found, display not found graphic
                  if (resultLength === 0) {
                    //clear hotel List
                    clearHotelList();
                    //hide pagination
                    $(".portfolio-pagination").hide();
                    //hide sort buttons
                    $(".btn-sort").hide();
                    //not found graphic
                    let notFoundGraphic = $("<img></img>");
                    notFoundGraphic.attr(
                      "src",
                      imgPath + "not-found-graphic.png"
                    );
                    notFoundGraphic.attr("alt", "not found graphic");
                    notFoundGraphic.attr("class", "not-found-graphic");

                    // Create div with class nfg and append the img element
                    let nfgDiv = $("<div></div>").addClass("nfg");
                    nfgDiv.append(notFoundGraphic);

                    // message text
                    messageContainer.css({
                      "background-color": "var(--awb-color5)",
                      "color": "white"
                    });
                    messageContainer.html(`
                      <div class="message-txt red">${hotelFilterTranslations.noResult}</div>  
                    `);
                    $("#message-wrapper").append(messageContainer);
                    $("#message-wrapper").append(nfgDiv);
                  }
                  // if hotels are found
                  else {
                    //show pagination
                    $(".portfolio-pagination").show();
                    //message text
                
                    messageContainer.html(`
                       <div class="message-txt green">
                            <h4 id="message-headline">${hotelFilterTranslations.yourSelection}: </h4>
                            <div class="message-filter-result">
                              <div class="result-title" id="title-country"><span class="txt-black">${hotelFilterTranslations.country}:</span><span class="txt-gray"> ${globalParams.country}</span></div>
                              <div class="result-title" id="title-city"><span class="txt-black">${hotelFilterTranslations.city}:</span><span class="txt-gray"> ${globalParams.city}</span></div>
                              <div class="result-title" id="title-parent-brand"><span class="txt-black">Franchise Partner:</span><span class="txt-gray"> ${globalParams.parent_brand}</span></div>
                              <div class="result-title" id="title-brand"><span class="txt-black">${hotelFilterTranslations.brand}:</span><span class="txt-gray"> ${globalParams.brand}</span></div>
                            </div>
                            <div><p class="result-message">${hotelFilterTranslations.searchResultet} <span class="txt-black"> ${resultLength} </span>${hotelFilterTranslations.hits}.</p></div>
                          </div>          
                      `);
                    
                    $("#message-wrapper").append(messageContainer);
                    if (resultHotelArr.length === fetchedHotels.length) { 
                      $(".result-message").html(`<span class="txt-black">Hotels:</span> ${resultHotelArr.length}`);
                  }
                    updateMessageContainer();
                  }
                }
                //update message container
                function updateMessageContainer(){
                  //remove show class from message elements
                  removeShowClass();


                  if (Object.keys(globalParams).length === 0) {
                  $('#message-headline').css('display','none');
                  }
                if (globalParams.country && globalParams.country !== "" && globalParams.country !== 'Country') {
                    $("#title-country").addClass("show");
                  }
                  if (globalParams.city && globalParams.city !== "" && globalParams.city !== 'City') {
                    $("#title-city").addClass("show");
                  }
                  if (globalParams.brand && globalParams.brand !== "" && globalParams.brand !=='Brand') {
                    $("#title-brand").addClass("show");
                  }
                  if (globalParams.parent_brand && globalParams.parent_brand !== "" && globalParams.parent_brand !== 'Franchise Partner') {
                    $("#title-parent-brand").addClass("show");
                  }
                }
                //remove show class from message elements
                function removeShowClass(){
                  let messageTitleArray = ['country', 'city', 'brand', 'parent-brand'];
                  messageTitleArray.forEach((element) => {
                    $(`#title-${element}`).removeClass("show");
                  });
                }
  //************SPLIT FUNCTION******************************/
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
                        splittResult.push({ pageNumber, pageArray });
                        startIdx = endIdx;
                        pageNumber++;
                    }
                    renderPageCont(splittResult[0].pageArray);
                    updatePagination();
                    console.log("splittResult", splittResult);
                }
                //renderPagination
                function renderPageCont(arr) {
                  renderList(arr);
                }
                //buttons pagination
                $(".arrow-pag").click((event) => {
                  //left arrow
                  if ($(event.currentTarget).hasClass("pleft")) {
                    if (currentPageNumber > 1) {
                      currentPageNumber--;
                      prevPageNumber = currentPageNumber - 1;
                      nextPageNumber = currentPageNumber + 1;
                      renderPageCont(splittResult[currentPageNumber - 1].pageArray);
                      updatePagination();
                      $('html, body').animate({ scrollTop: $('#scroll-link').offset().top },100);
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
                      renderPageCont(splittResult[currentPageNumber - 1].pageArray);
                      updatePagination();
                      $('html, body').animate({ scrollTop: $('#scroll-link').offset().top }, 100);
                    } else {
                      return;
                    }
                  }
                });
                //UPDATE PAGINATION ELEMENTS
                function updatePagination() {
                  $("#current-page").text(currentPageNumber);
                  $("#prev-page").text(prevPageNumber);
                  $("#next-page").text(nextPageNumber);
                  if (prevPageNumber == 0) {
                    $(".pleft").css("display", "none");
                    $("#prev-page").text(" ").css("background-color", "transparent");
                  } else {
                    $(".pleft").css("display", "flex");
                    $("#prev-page").css("background-color", "white");
                  }
                  if (nextPageNumber > splittResult.length) {
                    $(".pright, #next-page").css("display", "none");
                    $("#next-page").text(" ").css("background-color", "transparent");
                  } else {
                    $(".pright").css("display", "flex");
                    $("#next-page").css("background-color", "white");
                  }
                  if (splittResult.length < 2) {
                    $("#prev-page, #next-page").css("display", "none");
                  } else {
                    $("#prev-page, #next-page").css("display", "block");
                  }
                }
  /*************RENDER LIST OF CARDS*************************/
                function renderList(resultHotelArr) {
                  //remove old hotel list
                  clearHotelList();
                
                  for (let hotel of resultHotelArr) {
                    let hotelItem = document.createElement("div");
                    hotelItem.classList.add("card-wrapper");
                
                    hotelItem.innerHTML = `
                      <div class="card card-sl">
                        <div class="imgHotel">
                          <img src="${hotel.image}" alt="detail image ${hotel.name}">
                        </div>
                        <div class="innerCard">
                            <h4 class="titleCard ">${hotel.name}</h4>
                            <p class="hotel-address">${hotel.city}, ${hotel.country}</p>
                            <p class="hotel-send-mail">
                                <a href="mailto:${hotel.email}">Send email</a>
                            </p>
                            <a href="tel:${hotel.phone}" class="hotel-phone"> ${hotel.phone}</a>
                        </div>
                        <div class="btn-container">
                          <div>
                            <a href="${hotel.website}" class="btn-card" target="_blank">
                              <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" fill="none" style="max-width:20px;">
                                <path d="M1 5H19M15 1L19 5L15 9" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span style="width:120px;text-align: right;">Discover more</span>
                            </a>               
                          </div>
                        </div>
                      </div>
                    `;
                
                    if(hotel.website === null || hotel.website === ""){
                      hotelItem.querySelector(".btn-card").style.display = "none";  
                  }
                    document.getElementById("hotel-portfolio-container").appendChild(hotelItem);
                  }
                }
  
  /*************GET URL PARAMETER ***************************/ 
                function getParameter() { 
                  const params = {};
                  urlParams = new URLSearchParams(window.location.search);
                  for (const [key, value] of urlParams.entries()) {
                    params[key] = value;
                  }
                  //push paramters to input fields as value and call filterListByParams
                  if (params.hotel_country || params.city || params.brand) {
                    $('.selection-hr input[name="country"]').val(params.country);
                    $('.selection-hr input[name="City"]').val(params.city);
                    $('.selection-hr input[name="brand"]').val(params.brand);
                  
                    if (params.city) {
                      $("#city-header").text(params.city);
                        selectedCity = params.city;
                        }
                    if (params.country) {
                      $("#country-header").text(params.country);
                          selectedCountry = params.country;
                        }
                    if (params.brand) {
                      $("#brand-header").text(params.brand);
                          selectedBrand = params.brand;
                        }
                    if (params.parent_brand) {
                      $("#brand-header").text(params.parent_brand);
                          selectedParentBrand = params.parent_brand;
                        }                
                    }
              
                    globalParams  = params;
                    filterListByParams(params);
                }  

/*************FILTER LIST WITH PARAMETER*******************/  
            function filterListByParams(params) {
              resultHotelArr = [];

              for (let hotel of fetchedHotels) {
                  let matchesHotel = true;

                  // Check hotel_country parameter is set and matches
                  if (params.country?.toLowerCase() && !hotel.country.toLowerCase().includes(params.country.toLowerCase())) {
                      matchesHotel = false;
                  }

                  // Check city or county_town match
                  if (
                      params.city?.toLowerCase() && 
                      !(
                          hotel.city?.toLowerCase().includes(params.city.toLowerCase()) || 
                          hotel.county_town?.toLowerCase().includes(params.city.toLowerCase())
                      )
                  ) {
                      matchesHotel = false;
                  }

                  // Check brand parameter is set and matches
                  if (params.brand?.toLowerCase() && !hotel.brand.toLowerCase().includes(params.brand.toLowerCase())) {
                      matchesHotel = false;
                  }

                  // Check parent_brand parameter is set and matches
                  if (params.parent_brand?.toLowerCase() && !hotel.parent_brand.toLowerCase().includes(params.parent_brand.toLowerCase())) {
                      matchesHotel = false;
                  }
                  
                  // If all parameters are set and match, add hotel to resultHotelArr
                  if (matchesHotel) {
                      resultHotelArr.push(hotel);
                  }
              }

              globalParams = params;
              message(resultHotelArr.length);

              if (resultHotelArr.length > 0) {
                  splittArray(resultHotelArr);
                  generateDropdownOptions(resultHotelArr);
              } else {
                  window.history.pushState({}, document.title, window.location.pathname);
              }
            }
  
                  // Event Listener für Filter-Buttons
                  $(".btn-filter").click(function () {
                    const filterId = $(this).data("filter");
                    const filterValue = $(this).data("value");
  
                    // Setze den Wert ins Input-Feld
                    $(`#${filterId}-header`).val(filterValue);
                    $(`#${filterId}-options li`).show();
                    $(`.selection-hr input[name="${filterId.replace("-", " ")}"]`).val(filterValue);
  
                    handleEvent(); // Aktualisiert die Suche
                  });

  //************CHECK PARAMETERS*****************************/ 
                function checkParams() {
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.toString() === "") {
                      resultHotelArr = fetchedHotels;
                      globalParams = {};
                      generateDropdownOptions(resultHotelArr);
                      message(resultHotelArr.length);
                        splittArray(fetchedHotels);
                    } else {
                        getParameter();
                    }
                }
                checkParams();
                // Event Listener für externe Filter-Aufrufe
                window.addEventListener("checkParamsApplied", checkParams);

              }
          })
          .catch(error => {
              console.error("Fehler beim Abrufen der Hotel-Daten:", error);
          });
  });

})(jQuery);