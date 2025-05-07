(function($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Prüfen, ob "/en/" in der URL enthalten ist
    const lang = window.location.pathname.includes('/de/') ? 'de' : 'en';

    fetch(miceHotels.ajaxurl + `?action=mice_hotels_fetch&lang=${lang}`)
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
     let selectedArea = "";
     let selectedPeople = "";
 
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
function generateDropdownOptions(resultHotelArr) {
  const getUniqueSortedValues = (keys) => {
      return [...new Set(
          resultHotelArr
              .flatMap(h => keys.map(key => h[key]))
              .filter(Boolean)
              .map(v => v.trim())
      )];
  };

  // Collecting unique values for dropdowns
  const countries = getUniqueSortedValues(['country']).sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
  const cities = getUniqueSortedValues(['city', 'county_town']).sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
  const brand = getUniqueSortedValues(['brand']).sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
  const parentBrand = getUniqueSortedValues(['parent_brand']).sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
  let area = getUniqueSortedValues(['area']).sort();
  let people = getUniqueSortedValues(['people']).sort();

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
  populateDropdown("city-options", cities); // Cities now include County Towns
  populateDropdown("brand-options", brand);
  populateDropdown("parent-brand-options", parentBrand);
  populateDropdown("area-options", area);
  populateDropdown("people-options", people);
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
    setupDropdown("area-header", "area-options");
    setupDropdown("people-header", "people-options");
        
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
          { id: "parent-brand", placeholder: "Franchise Partner" },
          { id: "area", placeholder: hotelFilterTranslations.area },
          { id: "people", placeholder: hotelFilterTranslations.people }
      ];

      // Deactivate input fields to activ
      const areaInput = document.getElementById("area-header");
      const peopleInput = document.getElementById("people-header"); 
      if (areaInput) {
        areaInput.disabled = false; 
      }
      if (peopleInput) {  
        peopleInput.disabled = false;
      }
      
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
        let area = $("#area-header").val().trim(); 
        let people = $("#people-header").val().trim();

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
        const peopleInput = document.getElementById("people-header");

        if (area !== "" && area !== undefined) {
            argObj["area"] = area;
          
            // people input deaktivieren
            if (peopleInput) {
              peopleInput.disabled = true;
            }
          } else {
            // people input aktivieren, falls area leer ist
            if (peopleInput) {
              peopleInput.disabled = false;
            }
        }
        
        
        const areaInput = document.getElementById("area-header");

        if (people !== "" && people !== undefined) {
          argObj["people"] = people;
        
          // Feld deaktivieren
          if (areaInput) {
            areaInput.disabled = true;
          }
        } else {
          // Feld aktivieren, falls people leer ist
          if (areaInput) {
            areaInput.disabled = false;
          }
        }
        
        // URL aktualisieren
        pushArgToURL(argObj);

    }

  //*************PUSH ARGUMENTS TO URL***********/
    function pushArgToURL(argObj) {
      // Remove existing parameters from the URL
      let url = window.location.href.split("?")[0];
      let queryString = Object.keys(argObj)
        .map((key) => key + "=" + encodeURIComponent(argObj[key]))
        .join("&");
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
                              <div class="result-title" id="title-city"><span class="txt-black">${hotelFilterTranslations.city}:</span> <span class="txt-gray">${globalParams.city}</span></div>
                              <div class="result-title" id="title-brand"><span class="txt-black">${hotelFilterTranslations.brand}:</span> <span class="txt-gray">${globalParams.brand}</span></div>
                              <div class="result-title" id="title-parent-brand"><span class="txt-black">Franchise Partner:</span><span class="txt-gray">${globalParams.parent_brand}</span></div>
                              <div class="result-title" id="title-area"><span class="txt-black">${hotelFilterTranslations.area}:</span> <span class="txt-gray">${globalParams.area}</span></div>
                              <div class="result-title" id="title-people"><span class="txt-black">${hotelFilterTranslations.people}:</span> <span class="txt-gray">${globalParams.people}</span></div>
                            </div>
                            <div><p class="result-message">${hotelFilterTranslations.searchResultet} <span class="txt-black"> ${resultLength} </span>${hotelFilterTranslations.hits} .</p></div>
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
                  if (globalParams.area && globalParams.area !== "" && globalParams.area !== hotelFilterTranslations.area) {
                    $("#title-area").addClass("show");
                  }
                  if (globalParams.people && globalParams.people !== "" && globalParams.people !== hotelFilterTranslations.people) {
                    $("#title-people").addClass("show");
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
                    console.log('splittResult',splittResult );  
                    renderPageCont(splittResult[0].pageArray);
                    updatePagination();
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
    // Remove old hotel list
    clearHotelList();

    for (let hotel of resultHotelArr) {
        let hotelItem = document.createElement("div");
        hotelItem.classList.add("card-wrapper");

        // Dynamische Bildgrößen generieren (Basis-Pfad ohne .webp)
        let hotelImageBase = hotel.image.replace(".webp", "");
        let hotelImagePlacholder = imgUpl +'/2025/02/Platzhalter.webp';

        let hotelHTML = `
            <div class="card card-sl">
                <div class="imgHotel">
                    <img src="${hotelImageBase}.webp"
                        fallback="${hotelImagePlacholder}"
                         alt="meeting at ${hotel.name}"
                         >
                </div>
                <div class="innerCard">
                    <h4 class="titleCard">${hotel.name}</h4>
                    <p class="hotel-address">${hotel.city}, ${hotel.country}</p>
                    <p class="hotel-send-mail">
                        <a class="openFormParam" href="#">Send Request</a>
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

        //hide button if no website is available
        hotelItem.innerHTML = hotelHTML;
        if(hotel.website === null || hotel.website === ""){
            hotelItem.querySelector(".btn-card").style.display = "none";  
        }
      // Add event listener to the openFormParam button
      hotelItem.querySelector(".openFormParam").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default action

        // Generate the URL
        let nameParam = hotel.name;
        let baseUrl = "/meetings-events/contact-mice/?brand=";
        let url = baseUrl + encodeURIComponent(nameParam);

        // Update the browser history
        window.history.pushState({}, document.title, url);

        // Open the generated URL in a new tab
        window.open(url, '_blank');
      });
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
                  if (params.hotel_country || params.city || params.brand
                    || params.parent_brand || params.area || params.people) { 
                    $('.selection-hr input[name="country"]').val(params.country);
                    $('.selection-hr input[name="City"]').val(params.city);
                    $('.selection-hr input[name="brand"]').val(params.brand);
                    $('.selection-hr input[name="parent brand"]').val(params.parent_brand);
                    $('.selection-hr input[name="area"]').val(params.area);
                    $('.selection-hr input[name="people"]').val(params.people);
                  

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
                    if(params.area){
                      $("#area-header").text(params.area);  
                      selectedArea = params.area;
                    }
                    if(params.people){
                      $("#people-header").text(params.people);  
                      selectedPeople = params.people;
                    }

              
                    globalParams  = params;
                    console.log("globalParams", globalParams);
                    filterListByParams(params);
                }  

  /*************FILTER LIST WITH PARAMETER*******************/  
  function filterListByParams(params) {
    resultHotelArr = [];

    for (let hotel of fetchedHotels) {
        let matchesHotel = true;

          // Allgemeine String-Checks für alle anderen Filter
          if (params.country != null && !hotel.country.toLowerCase().includes(params.country.toLowerCase())) {
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
          if (params.brand != null && !hotel.brand.toLowerCase().includes(params.brand.toLowerCase())) {
            matchesHotel = false;
          }
          if (params.parent_brand != null && !hotel.parent_brand.toLowerCase().includes(params.parent_brand.toLowerCase())) {
            matchesHotel = false;
          }

        // 🔹 **Neue Logik für `area`**
        if (params.area) {
            let areaFilter = params.area.trim();
            let hotelArea = (hotel.area || "").trim();

            if (areaFilter === "<100") {
                matchesHotel = true;
            } else if (areaFilter === "100-500") {
                if (!(hotelArea === "100-500" || hotelArea === "500-1000" || hotelArea === "1000+")) {
                    matchesHotel = false;
                }
            } else if (areaFilter === "500-1000") {
                if (!(hotelArea === "500-1000" || hotelArea === "1000+")) {
                    matchesHotel = false;
                }
            } else if (areaFilter === "1000+") {
                if (hotelArea !== "1000+") {
                    matchesHotel = false;
                }
            }
        }

        // 🔹 **Neue Logik für `people`**
        if (params.people) {
            let peopleFilter = params.people.trim();
            let hotelPeople = (hotel.people || "").trim();

            if (peopleFilter === "<150") {
                matchesHotel = true;
            } else if (peopleFilter === "150-300") {
                if (!(hotelPeople === "150-300" || hotelPeople === "300-500" || hotelPeople === "500-1000" || hotelPeople === "1000+")) {
                    matchesHotel = false;
                }
            } else if (peopleFilter === "300-500") {
                if (!(hotelPeople === "300-500" || hotelPeople === "500-1000" || hotelPeople === "1000+")) {
                    matchesHotel = false;
                }
            } else if (peopleFilter === "500-1000") {
                if (!(hotelPeople === "500-1000" || hotelPeople === "1000+")) {
                    matchesHotel = false;
                }
            } else if (peopleFilter === "1000+") {
                if (hotelPeople !== "1000+") {
                    matchesHotel = false;
                }
            }
        }

        // 🔹 Falls alle Bedingungen erfüllt sind, füge das Hotel zur Ergebnisliste hinzu
        if (matchesHotel) {
            resultHotelArr.push(hotel);
        }
    }

    // 🔹 Ergebnisse weiterverarbeiten
    globalParams = params;
    message(resultHotelArr.length);

    if (resultHotelArr.length > 0) {
        for (let hotel of resultHotelArr) {
        }
        splittArray(resultHotelArr);
        generateDropdownOptions(resultHotelArr);
    } else {
        window.history.pushState({}, document.title, window.location.pathname);
    }
}


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