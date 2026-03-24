// === CREATE MARKERS AND CLUSTER ===
let openInfoWindow = null; // <-- add this variable at the right scope (outside the function if you want to persist between render calls)

function renderMarkers(hotels) {
    clearMarkers();

    hotels.forEach(hotel => {
        if (!hotel.lat || !hotel.lng) return;

        const iconUrl = brandIcons[hotel.brand]?.url || defaultMarkerIcon;

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lng) },
            title: hotel.name,
            content: createCustomMarkerContent(iconUrl)
        });

        const infoWindow = new google.maps.InfoWindow({
            content: createPopupContent(hotel)
        });

        marker.addListener('click', () => {
            // Close the previously open infoWindow
            if (openInfoWindow) {
                openInfoWindow.close();
            }
            // Open this infoWindow and set as currently open
            infoWindow.open({ anchor: marker, map });
            openInfoWindow = infoWindow;

            disableAreaAndPeopleInPopup();
        });

        markers.push(marker);
    });

loadMarkerClusterer(() => {
    const { MarkerClusterer } = window.markerClusterer;
    clusterer = new MarkerClusterer({
        map,
        markers,
        renderer: {
            render({ count, position }) {
                let iconUrl;
                let size = 40;

                // Verschiedene Icons und Größen je nach Anzahl
                if (count < 10) {
                    iconUrl = 'https://revo-hospitality-group.com/wp-content/uploads/2025/07/revo_cluster.png';
                    size = 40;
                } else if (count < 50) {
                    iconUrl = 'https://revo-hospitality-group.com/wp-content/uploads/2025/07/revo_cluster.png';
                    size = 50;
                } else {
                    iconUrl = 'https://revo-hospitality-group.com/wp-content/uploads/2025/07/revo_cluster.png';
                    size = 60;
                }

                return new google.maps.Marker({
                    position,
                    icon: {
                        url: iconUrl,
                        scaledSize: new google.maps.Size(size, size),
                    },
                    label: {
                        text: String(count),
                        color: "#fff",
                        fontSize: "14px"
                    }
                });
            }
        }
    });
});





}

function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
    if (clusterer) clusterer.clearMarkers();
}

function loadMarkerClusterer(callback) {
    if (window.markerClusterer) {
        if (typeof callback === 'function') callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
    script.onload = callback;
    document.body.appendChild(script);
}

// Verstecke die Dropdown-Optionen initial
const optionLists = document.querySelectorAll(".select-options");
optionLists.forEach(el => el.style.display = "none");

allHotels = []; // make sure this is assigned when data loads
let currentFocusIndex = -1;

// Load Google Maps API with Avada Privacy Integration
function loadGoogleMapsAPI(callback) {
    if (window.google && window.google.maps) {
        if (typeof callback === "function") callback();
        return;
    }

    if (typeof AvadaPrivacy !== 'undefined' && typeof AvadaPrivacy.registerScript === 'function') {
        // Use Avada's privacy API to load the script
        AvadaPrivacy.registerScript({
            type: 'gmaps',
            src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDMhjtJKVkQN6D1Lme60gjL_u-DO5aMTiQ&callback=initRevoHotelsMap&libraries=marker',
            id: 'google-maps-api-js',
            async: true,
            defer: true
        });
    } else {
        // Directly load Google Maps API if Avada Privacy is not active
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDMhjtJKVkQN6D1Lme60gjL_u-DO5aMTiQ&callback=' + callback.name + '&libraries=marker';
        script.id = 'google-maps-api-js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}

// GDPR (DSGVO) Consent Layer with Local Storage
function showGDPRConsent() {
    // Check if user has already given consent
    if (localStorage.getItem("gdprConsent") === "true") {
        loadGoogleMapsAPI(initRevoHotelsMap);
        return;
    }

    const consentLayer = document.createElement("div");
    consentLayer.id = "gdpr-consent-layer";
    consentLayer.style.position = "fixed";
    consentLayer.style.top = "0";
    consentLayer.style.left = "0";
    consentLayer.style.width = "100%";
    consentLayer.style.height = "100%";
    consentLayer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    consentLayer.style.display = "flex";
    consentLayer.style.alignItems = "center";
    consentLayer.style.justifyContent = "center";
    consentLayer.style.zIndex = "9999";
    consentLayer.style.color = "white";

    consentLayer.innerHTML = `
        <div style="background: #333; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px;">
            <h2 style="margin-bottom: 15px;color:white;">${hotelFilterTranslations.consentHeadline}</h2>
            <p>${hotelFilterTranslations.consentText}</p>
            <button id="gdpr-consent-btn" style="margin-top: 15px; padding: 10px 20px; background-color: var(--awb-color5); border: none; cursor: pointer; color: white;">${hotelFilterTranslations.showMap}</button>
            <button id="gdpr-withdraw-btn" style="cursor: pointer; color: white;display:none;">Einwilligung zurückziehen</button>
        </div>
    `;

    document.body.appendChild(consentLayer);

    document.getElementById("gdpr-consent-btn").addEventListener("click", function() {
        localStorage.setItem("gdprConsent", "true"); // Save consent
        document.body.removeChild(consentLayer);
        loadGoogleMapsAPI(initRevoHotelsMap); // Load the map after consent
    });

    document.getElementById("gdpr-withdraw-btn").addEventListener("click", function() {
        localStorage.removeItem("gdprConsent"); // Remove consent
        alert("Ihre Einwilligung wurde zurückgezogen.");
        location.reload();
    });
}

// Initialize the map ONLY after consent
document.addEventListener("DOMContentLoaded", () => {
    showGDPRConsent();
});

function initRevoHotelsMap() {
    const mapEl = document.getElementById('revo-hotels-map');
    if (!mapEl) return;

    // get data from revo-hotels-map-root
    const mice = document.getElementById('revo-hotels-map-root').dataset.mice;
    let ajaxUrl = `${revoHotelsMaps.ajax_url}?action=revo_hotels_maps_fetch&lang=${revoHotelsMaps.lang}`;
    window.isMice = false;
    if (mice && mice === '1') {
        ajaxUrl += '&mice=1';
        window.isMice = true;
    }
    fetch(ajaxUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.success || !Array.isArray(data.data)) {
                alert("Keine Hotel-Daten gefunden.");
                return;
            }

            allHotels = data.data;
            console.log('allHotels:', allHotels);

            map = new google.maps.Map(mapEl, {
                center: { lat: 51, lng: 10 },
                zoom: 4,
                mapId: "b7d66f7add83f786"
            });

            console.log('window.isMice: '+ window.isMice);
            checkParams();
        });
}
// add styles if isMice is true
function addMiceStylesIfNeeded(){
    if (!window.isMice) return;
    document.querySelectorAll('.selection-hr').forEach(el => {
        el.classList.add('selection-hr-mice');
    });
    document.getElementById('btn-reset').classList.add('btn-reset-mice');
}

// Get URL parameters as an object
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}
// Check URL parameters and set input values accordingly
function checkParams() {
    addMiceStylesIfNeeded();
    const urlParams = getURLParams();
    if (urlParams && Object.keys(urlParams).length > 0 && Object.values(urlParams).some(v => v)) {
        const { city, country, brand, parent_brand, area, people } = urlParams;

        if (city) document.getElementById('city-header').value = city;
        if (country) document.getElementById('country-header').value = country;
        if (brand) document.getElementById('brand-header').value = brand;
        if (parent_brand) document.getElementById('parent_brand-header').value = parent_brand;
        if (area) document.getElementById('area-header').value = area;
        if (people) document.getElementById('people-header').value = people;

        filterMarkers();        // Your filtering function
    }else {
        // If no params, reset the map and markers
        zoomOut();
        clearMarkers();
        updateResultMessage(allHotels.length, allHotels);
        renderMarkers(allHotels); // Render all hotels
        generateDropdownOptions(allHotels); // Generate dropdown options from all hotels
        updateGridViewBtn();  

    }
}
// Update grid view button based on URL parameters
function updateGridViewBtn() {
    const gridViewBtn = document.getElementById("grid-view-btn");
    if (!gridViewBtn) return;

    // Remove old data-url
    gridViewBtn.removeAttribute("data-url");

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = [...urlParams.values()].some(value => value && value.trim() !== "");
    const objectType = urlParams.get('object_type');

    // Remove trailing '/maps/' from pathname if present
    basePath = revoHotelsMaps.siteUrl; 
    console.log(revoHotelsMaps.lang);
    if (revoHotelsMaps.lang === 'de_DE') {
        basePath = basePath + "/de";
    } 
    // Append proper suffix
    if (window.isMice) {
        basePath += "/meetings-events/";
    } else {
        basePath += "/portfolio/hotels/";
    }
    // Build final URL with or without params
    let finalUrl = basePath;
    if (hasParams) {
        finalUrl += `?${urlParams.toString()}`;
    }
    // Append scroll anchor
    finalUrl += "#scroll-link";
    // Set attributes
    gridViewBtn.setAttribute("data-url", finalUrl);
    gridViewBtn.href = finalUrl; // Optional: enable native anchor/fallback
}
// Push input values to URL and reapply them
function pushToUrl() {
    updateURLParamsFromInputs();
    checkParams();
}
// Update the URL based on current input values
function updateURLParamsFromInputs() {
    const params = new URLSearchParams();
    const addParam = (id, key) => {
        const el = document.getElementById(id);
        if (el && el.value.trim()) {
            params.set(key, el.value.trim());
        }
    };
    addParam('city-header', 'city');
    addParam('country-header', 'country');
    addParam('brand-header', 'brand');
    addParam('parent_brand-header', 'parent_brand');
    addParam('area-header', 'area');
    addParam('people-header', 'people');

    const paramStr = params.toString();
    const newUrl = paramStr ? `${window.location.pathname}?${paramStr}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
}
// Generate Dropdown Options (including County Town in City Dropdown)
function generateDropdownOptions(hotels) {
    const unique = key =>
        [...new Set(hotels.map(h => h[key]).filter(Boolean).map(v => v.trim()))]
        .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));

    const fillOptions = (id, values) => {
        const list = document.getElementById(id);
        if (!list) return;
        list.innerHTML = values.map(v => `<li data-value="${v}">${v}</li>`).join('');

        // Add event listeners again each time
        list.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', function (e) {
                const input = document.getElementById(id.replace("-options", "-header"));
                if (input) {
                    input.value = this.textContent;
                    pushToUrl();
                }
                list.style.display = "none";
            });
        });
    };

    // City Dropdown with additional County Town values
    const cities = unique('city');
    const countyTowns = hotels.map(h => h.county_town).filter(ct => ct && !cities.includes(ct));
    const combinedCities = [...new Set([...cities, ...countyTowns])].sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));

    //mapping object types
    const objectTypes = unique('object_type');

    fillOptions('country-options', unique('country'));
    fillOptions('city-options', combinedCities);
    fillOptions('parent_brand-options', unique('parent_brand'));
    fillOptions('brand-options', unique('brand'));
    fillOptions('area-options', unique('area'));
    fillOptions('people-options', unique('people'));
    disableConferenceSpaceAndParticipants();
}

// Disbable input fields Conference Space and Number of Participants if not MICE Hotels
function disableConferenceSpaceAndParticipants() {
    const miceElements = document.querySelectorAll('.mice-only');
    console.log('disableConferenceSpaceAndParticipants called, isMice:', window.isMice);

    if (window.isMice) {
        miceElements.forEach(el => {
            el.style.display = 'block';
            const input = el.querySelector('input');
            if (input) input.disabled = false;
        });
    } else {
        miceElements.forEach(el => {
            el.style.display = 'none';
            const input = el.querySelector('input');
            if (input) input.disabled = true;
            // clear values of inputs and remove markers and remove it from URL
        });
    }
}
disableConferenceSpaceAndParticipants();
//function to toggle area and people inputs based on their values
function toggleAreaAndPeopleInputs() {
    const areaInput = document.getElementById("area-header");
    const peopleInput = document.getElementById("people-header");

    if (!areaInput || !peopleInput) return;

    const areaVal = areaInput.value.trim();
    const peopleVal = peopleInput.value.trim();

    if (areaVal !== "" && peopleVal === "") {
        // Disable people
        peopleInput.classList.add("disabled");
        peopleInput.setAttribute("readonly", true);
        peopleInput.setAttribute("aria-disabled", "true");
        peopleInput.parentElement.classList.add("dropdown-disabled");

        // Enable area
        areaInput.classList.remove("disabled");
        areaInput.removeAttribute("aria-disabled");
        areaInput.parentElement.classList.remove("dropdown-disabled");

    } else if (peopleVal !== "" && areaVal === "") {
        // Disable area
        areaInput.classList.add("disabled");
        areaInput.setAttribute("readonly", true);
        areaInput.setAttribute("aria-disabled", "true");
        areaInput.parentElement.classList.add("dropdown-disabled");

        // Enable people
        peopleInput.classList.remove("disabled");
        peopleInput.removeAttribute("aria-disabled");
        peopleInput.parentElement.classList.remove("dropdown-disabled");

    } else {
        // Enable both
        areaInput.classList.remove("disabled");
        peopleInput.classList.remove("disabled");
        areaInput.removeAttribute("aria-disabled");
        peopleInput.removeAttribute("aria-disabled");
        areaInput.parentElement.classList.remove("dropdown-disabled");
        peopleInput.parentElement.classList.remove("dropdown-disabled");
    }
}
//disable area and people in Popup if not MICE Hotels
function disableAreaAndPeopleInPopup() {
 const popupArea = document.querySelector('.popup-area');    
    const popupPeople = document.querySelector('.popup-people');
    if (!popupArea || !popupPeople) return; 
    if (window.isMice) {
        popupArea.style.display = 'block';
        popupPeople.style.display = 'block';
    } else {
        popupArea.style.display = 'none';
        popupPeople.style.display = 'none';
    }}
const allInputs = document.querySelectorAll(".select-header input");
allInputs.forEach(input => {
    const optionsId = input.id.replace("-header", "-options");
    const options = document.getElementById(optionsId);

    input.addEventListener("focus", () => {
        if (options) {
            optionLists.forEach(list => { if (list !== options) list.style.display = "none"; });
            options.style.display = "block";
        }
    });

    input.addEventListener("input", () => {
        if (!options) return;
        const term = input.value.toLowerCase();
        const listItems = options.querySelectorAll("li");
        let matchFound = false;

        listItems.forEach(li => {
            const text = li.textContent.toLowerCase();
            if (text.startsWith(term)) {
                li.style.display = "block";
                matchFound = true;
            } else {
                li.style.display = "none";
            }
            li.classList.remove("highlighted");
        });

        if (!matchFound) {
            if (!options.querySelector(".no-results")) {
                const noResult = document.createElement("li");
                noResult.className = "no-results";
                noResult.textContent = "Keine Ergebnisse gefunden";
                options.appendChild(noResult);
            }
        } else {
            const existing = options.querySelector(".no-results");
            if (existing) existing.remove();
        }

        currentFocusIndex = -1;
        options.style.display = "block";
    });

    input.addEventListener("keydown", (e) => {
        if (!options) return;
        const items = Array.from(options.querySelectorAll("li:not([style*='display: none'])"));

        if (e.key === "ArrowDown") {
            e.preventDefault();
            currentFocusIndex = (currentFocusIndex + 1) % items.length;
            setActiveItem(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            currentFocusIndex = (currentFocusIndex - 1 + items.length) % items.length;
            setActiveItem(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentFocusIndex > -1 && items[currentFocusIndex]) {
                const value = items[currentFocusIndex].textContent;
                input.value = value;
                pushToUrl();
                options.style.display = "none";
            } else {
                pushToUrl();
                options.style.display = "none";
            }
        }
    });

    // Create and insert clear buttons if missing
    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("clear-button")) {
        const clearBtn = document.createElement("button");
        clearBtn.className = "clear-button";
        clearBtn.textContent = "✕";
        clearBtn.setAttribute("data-input", input.id);
        input.parentNode.insertBefore(clearBtn, input.nextSibling);
    }
});

function setActiveItem(items) {
    items.forEach(item => item.classList.remove("highlighted"));
    if (currentFocusIndex >= 0 && currentFocusIndex < items.length) {
        items[currentFocusIndex].classList.add("highlighted");
        items[currentFocusIndex].scrollIntoView({ block: "nearest" });
    }
}
//clear button functionality
document.addEventListener("click", e => {
    if (e.target.classList.contains("clear-button")) {
        e.preventDefault();
        const inputId = e.target.getAttribute("data-input");
        clearField(inputId);
        return;
    }

    if (!e.target.closest(".selection-hr")) {
        optionLists.forEach(list => list.style.display = "none");
    }
});
// Reset single field
function clearField(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.value = "";

    // inputId is city-header, country-header, brand-header, parent_brand-header, area-header or people-header
    //the parameter of the element to be cleared is the same without the "-header" suffix
    const params = new URLSearchParams(window.location.search);
    const paramName = inputId.replace("-header", "");
    console.log('Clearing URL parameter: ' + paramName);
    // Clear the URL parameter
    params.delete(paramName);



    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    console.log('New URL after clearing field: ' + newUrl);
    window.history.replaceState({}, '', newUrl);
    // Update UI and state
    updateMessageContainer();
    updateGridViewBtn();
    clearMarkers();
    zoomOut();
    filterMarkers();
}
// ZOOM Out
function zoomOut() {
    map.setCenter({ lat: 51, lng: 10 });
    map.setZoom(4);
}
// Reset ALL fields
const resetBtn = document.getElementById("btn-reset");
// Reset button functionality
if (resetBtn) {
  // Click event
  resetBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearAllFields();
    filterMarkers();
    updateResultMessage(allHotels.length, allHotels);
  });

  // Enter key event
  resetBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      clearAllFields();
      filterMarkers();
      updateResultMessage(allHotels.length, allHotels);
    }
  });

  // Optional: Ensure the element is keyboard-focusable
  if (!resetBtn.hasAttribute("tabindex")) {
    resetBtn.setAttribute("tabindex", "0");
  }
  if (!resetBtn.hasAttribute("role")) {
    resetBtn.setAttribute("role", "button");
  }
}
// Clear all fields and reset map
function clearAllFields() {
    // Clear all input fields
    allInputs.forEach(input => {    
        input.value = "";
    });
    // Clear URL parameters
    clearURLParams();
    // remove all markers
    clearMarkers();
    // Reset map to default
    zoomOut()
}
function clearURLParams() {
    const params = new URLSearchParams(window.location.search);
    params.delete('city');
    params.delete('country');
    params.delete('brand');
    params.delete('parent_brand');
    params.delete('object_type');
    params.delete('area');
    params.delete('people');
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
};
// Message Wrapper
function updateResultMessage(count, filteredHotels) {
    const wrapper = document.getElementById("message-wrapper");
    if (!wrapper) return;

    document.getElementById("message-wrapper").innerHTML = "";

    const messageContainer = document.createElement("div");
    messageContainer.id = "message-container";

    if (count === 0) {
        const nfgDiv = document.createElement("div");
        nfgDiv.className = "nfg";


        messageContainer.innerHTML = `<div class="message-txt red">Keine Hotels gefunden</div>`;
        messageContainer.style.backgroundColor = "var(--awb-color5)";
        messageContainer.style.color = "white";

        wrapper.appendChild(messageContainer);
        wrapper.appendChild(nfgDiv);
    } else {
        let country = document.getElementById('country-header').value.trim();
        let city = document.getElementById('city-header').value.trim();
        let parentBrand = document.getElementById('parent_brand-header').value.trim();
        let brand = document.getElementById('brand-header').value.trim();
        let area = document.getElementById('area-header').value.trim();
        let people = document.getElementById('people-header').value.trim();

        messageContainer.innerHTML = `
            <div class="message-txt green" role="region" aria-labelledby="message-headline">
            <h4 id="message-headline">${hotelFilterTranslations.yourSelection}:</h4>

            <div class="message-filter-result">
                <div class="result-title" id="title-country">
                <span class="txt-black" aria-hidden="true">${hotelFilterTranslations.country}:</span>
                <span class="txt-gray" aria-label="${hotelFilterTranslations.country}">${country}</span>
                </div>

                <div class="result-title" id="title-city">
                <span class="txt-black" aria-hidden="true">${hotelFilterTranslations.city}:</span>
                <span class="txt-gray" aria-label="${hotelFilterTranslations.city}">${city}</span>
                </div>

                <div class="result-title" id="title-parent_brand">
                <span class="txt-black" aria-hidden="true">Franchise Partner:</span>
                <span class="txt-gray" aria-label="Franchise Partner">${parentBrand}</span>
                </div>

                <div class="result-title" id="title-brand">
                <span class="txt-black" aria-hidden="true">${hotelFilterTranslations.brand}:</span>
                <span class="txt-gray" aria-label="${hotelFilterTranslations.brand}">${brand}</span>
                </div>

                <div class="result-title" id="title-area">
                <span class="txt-black" aria-hidden="true">${hotelFilterTranslations.conferenceSpace}:</span>
                <span class="txt-gray" aria-label="area">${area}</span>
                </div>

                <div class="result-title" id="title-people">
                <span class="txt-black" aria-hidden="true">${hotelFilterTranslations.numberOfParticipants}:</span>
                <span class="txt-gray" aria-label="area">${people}</span>
                </div>
            </div>

            <div>
                <p class="result-message" aria-live="polite">
                ${hotelFilterTranslations.searchResultet}:
                <span class="txt-black" aria-label="Result count">${count}</span>
                ${hotelFilterTranslations.hits}
                </p>
            </div>
            </div>

            `;

        wrapper.appendChild(messageContainer);
        updateMessageContainer();
    }
}
// Update message container based on input values
function updateMessageContainer() {
    removeShowClass();

    if (document.getElementById("country-header").value.trim()) {
        document.getElementById("title-country")?.classList.add("show");
    }
    if (document.getElementById("city-header").value.trim()) {
        document.getElementById("title-city")?.classList.add("show");
    }
    if (document.getElementById("brand-header").value.trim()) {
        document.getElementById("title-brand")?.classList.add("show");
    }
    if (document.getElementById("parent_brand-header").value.trim()) {
        document.getElementById("title-parent_brand")?.classList.add("show");
    }
    if (document.getElementById("area-header").value.trim()) {
        document.getElementById("title-area")?.classList.add("show");
    }
    if (document.getElementById("people-header").value.trim()) {
        document.getElementById("title-people")?.classList.add("show");
    }   
    if (!document.getElementById("country-header").value 
    && !document.getElementById("city-header").value 
    && !document.getElementById("brand-header").value 
    && !document.getElementById("parent_brand-header").value
    && !document.getElementById("area-header").value
    && !document.getElementById("people-header").value) {
        document.getElementById("message-headline")?.style.setProperty("display", "none");
    }
}
// Remove "show" class from all titles in the message container
function removeShowClass() {
    const ids = ['country', 'city', 'brand', 'parent_brand', 'area', 'people'];
    ids.forEach(id => {
        document.getElementById(`title-${id}`)?.classList.remove("show");
    });
}
//Expected filterMarkers implementation placeholder:
function filterMarkers() {
    const countryFilter = document.getElementById('country-header').value.trim().toLowerCase();
    const cityFilter = document.getElementById('city-header').value.trim().toLowerCase();
    const brandFilter = document.getElementById('brand-header').value.trim().toLowerCase();
    const parentBrandFilter = document.getElementById('parent_brand-header').value.trim().toLowerCase();
    const areaFilter = document.getElementById('area-header').value.trim();
    const peopleFilter = document.getElementById('people-header').value.trim();

    toggleAreaAndPeopleInputs();

const filtered = allHotels.filter(hotel => {
  // Safe property access
  const hotelCountry = (hotel.country || "").toLowerCase();
  const hotelCity = (hotel.city || "").toLowerCase();
  const hotelCountyTown = (hotel.county_town || "").toLowerCase();
  const hotelBrand = (hotel.brand || "").toLowerCase();
  const hotelParentBrand = (hotel.parent_brand || "").toLowerCase();
  const hotelArea = (hotel.area || "").trim();
  const hotelPeople = (hotel.people || "").trim();

  // 🔹 Exact-match lists
  const exactMatchCities = ["erding"];
  const exactMatchBrands = ["holiday inn", "holiday inn express"];

  // 🔹 Country filter
  const matchCountry = !countryFilter || hotelCountry.includes(countryFilter);

  // 🔹 City filter with exception logic
  let matchCity = true;
  if (cityFilter) {
    const cityParam = cityFilter.toLowerCase();
    if (exactMatchCities.includes(cityParam)) {
      matchCity = hotelCity === cityParam || hotelCountyTown === cityParam;
    } else {
      matchCity = hotelCity.includes(cityParam) || hotelCountyTown.includes(cityParam);
    }
  }

  // 🔹 Brand filter with exception logic
  let matchBrand = true;
  if (brandFilter) {
    const brandParam = brandFilter.toLowerCase();
    if (exactMatchBrands.includes(brandParam)) {
      matchBrand = hotelBrand === brandParam;
    } else {
      matchBrand = hotelBrand.includes(brandParam);
    }
  }

  // 🔹 Parent brand filter
  const matchParentBrand = !parentBrandFilter || hotelParentBrand.includes(parentBrandFilter);

  // 🔹 Area filter
  let matchArea = true;
  if (areaFilter) {
    if (areaFilter === "<100") {
      matchArea = true;
    } else if (areaFilter === "100-500") {
      matchArea = hotelArea === "100-500" || hotelArea === "500-1000" || hotelArea === "1000+";
    } else if (areaFilter === "500-1000") {
      matchArea = hotelArea === "500-1000" || hotelArea === "1000+";
    } else if (areaFilter === "1000+") {
      matchArea = hotelArea === "1000+";
    } else {
      matchArea = false;
    }
  }

  // 🔹 People filter
  let matchPeople = true;
  if (peopleFilter) {
    if (peopleFilter === "<150") {
      matchPeople = true;
    } else if (peopleFilter === "150-300") {
      matchPeople = ["150-300", "300-500", "500-1000", "1000+"].includes(hotelPeople);
    } else if (peopleFilter === "300-500") {
      matchPeople = ["300-500", "500-1000", "1000+"].includes(hotelPeople);
    } else if (peopleFilter === "500-1000") {
      matchPeople = ["500-1000", "1000+"].includes(hotelPeople);
    } else if (peopleFilter === "1000+") {
      matchPeople = hotelPeople === "1000+";
    } else {
      matchPeople = false;
    }
  }

  return matchCountry && matchCity && matchBrand && matchParentBrand && matchArea && matchPeople;
});

    console.log('Filtered Hotels:', filtered);
    renderMarkers(filtered); // Your rendering logic
    generateDropdownOptions(filtered);
    disableConferenceSpaceAndParticipants(); // Disable conference space and participants if not MICE
    updateGridViewBtn();    // Sets data-url on the button
    updateResultMessage(filtered.length, filtered);
}

// === MARKER & POPUP HELPERS ===
function createCustomMarkerContent(iconUrl) {
    const div = document.createElement('div');
    div.className = 'custom-marker';
    div.innerHTML = `<img src="${iconUrl}" style="width:40px;height:auto;">`;
    return div;
}
//render popup content
function createPopupContent(hotel) {
    const image = hotel.image || defaultHotelImage;
    return `
       <div class="popWrap" role="region" aria-label="Hotel information for ${hotel.name}">
            <img 
                src="${image}" 
                class="hotelImg" 
                alt="Image of ${hotel.name}" 
                style="width:30%; height:auto; object-fit:cover;"
            >

            <div class="contTxt">
                <h3 class="hotelHead">${hotel.name}</h3>

                <p class="hotel-address">
                <img src="${imgPath}location_on.svg" alt="Location" width="16" height="16">
                <span>${hotel.street}, ${hotel.zip} ${hotel.city}</span>
                </p>

                <p class="popup-area">
                <img src="${imgPath}area.svg" alt="Conference space" width="16" height="16" style="margin-right: 12px;">
                <span>${hotelFilterTranslations.conferenceSpace}: ${hotel.area}</span>
                </p>
                <p class="popup-people">
                <img src="${imgPath}people.svg" alt="number of participants" width="16" height="16" style="margin-right: 12px;">
                <span>${hotelFilterTranslations.numberOfParticipants}: ${hotel.people}</span>
                </p>

                <p class="hotel-phone">
                <img src="${imgPath}call.svg" alt="Phone" width="16" height="16">
                <a href="tel:${hotel.phone}" aria-label="Call ${hotel.name} at ${hotel.phone}">
                    ${hotel.phone}
                </a>
                </p>

                <p class="hotel-email">
                <img src="${imgPath}mail.svg" alt="Email" width="16" height="16">
                <a href="mailto:${hotel.email}" aria-label="Email ${hotel.name} at ${hotel.email}">
                    ${hotel.email}
                </a>
                </p>

                <div class="btnWrap">
                    <div>
                        <a href="${hotel.website}" rel="nofollow" class="btn-card" target="_blank" aria-label="Visit the website of ${hotel.name}">
                        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" fill="none" style="max-width:18px;margin-right: 2px;" aria-hidden="true" focusable="false">
                            <path d="M1 5H19M15 1L19 5L15 9" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span style="width:120px; text-align:right;" class="popTxt">${hotelFilterTranslations.discoverMore}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

}
