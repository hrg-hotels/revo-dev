

// === GLOBALS ===
const defaultMarkerIcon = "http://localhost/hrgredesign/wp-content/uploads/2025/05/HRG_maps_marker.svg";
const defaultHotelImage = "https://www.hrg-hotels.com/hubfs/HRG/Corporate%20Pages/Portfolio/Hotel-Images/Platzhalter.jpg";
let map, markers = [], clusterer, allHotels = [];

const brandIcons = {
    "Vienna House by Wyndham": { url: "http://localhost/hrgredesign/wp-content/uploads/2025/05/VH_maps_icon.svg" },
    "TrademarkCollectionbyWyndham": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/amedia_marker.png" },
    "Adagio Access": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/adagio_original_marker.png" },
    "ibis Styles": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/ibis_styles_marker.png" },
    "Dorint": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/dorint_marker.png" },
    "Hilton": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/hilton_marker.png" },
    "HolidayInnExpress": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/holiday_inn_express_marker.png" },
    "Hyatt": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/hyatt_marker.png" },
    "Ibisbudget": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/ibis_budget_marker.png" },
    "Mercure": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/mercure_marker.png" },
    "Mövenpick": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/moevenpick_marker.png" },
    "Pullman": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/pullman_marker.png" },
    "Ramada by Wyndham": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/ramada_marker.png" },
    "HolidayInn": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/holiday_inn_marker.png" }
};

// === CREATE MARKERS AND CLUSTER ===
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
            infoWindow.open({ anchor: marker, map });
        });

        markers.push(marker);
    });

    loadMarkerClusterer(() => {
        const { MarkerClusterer } = window.markerClusterer;
        clusterer = new MarkerClusterer({ map, markers });
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
            src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=initRevoHotelsMap&libraries=marker',
            id: 'google-maps-api-js',
            async: true,
            defer: true
        });
    } else {
        // Directly load Google Maps API if Avada Privacy is not active
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=' + callback.name + '&libraries=marker';
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
            <h2 style="margin-bottom: 15px;">Datenschutz-Einwilligung</h2>
            <p>Um die Karte anzuzeigen, müssen Sie der Verwendung von Google Maps zustimmen.</p>
            <button id="gdpr-consent-btn" style="margin-top: 15px; padding: 10px 20px; background-color: #4CAF50; border: none; cursor: pointer; color: white;">Karte anzeigen</button>
            <button id="gdpr-withdraw-btn" style="margin-top: 15px; padding: 10px 20px; background-color: #f44336; border: none; cursor: pointer; color: white;">Einwilligung zurückziehen</button>
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
            src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=initRevoHotelsMap&libraries=marker',
            id: 'google-maps-api-js',
            async: true,
            defer: true
        });
    } else {
        // Directly load Google Maps API if Avada Privacy is not active
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=' + callback.name + '&libraries=marker';
        script.id = 'google-maps-api-js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}

function initRevoHotelsMap() {
    const mapEl = document.getElementById('revo-hotels-map');
    if (!mapEl) return;

    fetch(`${revoHotelsMaps.ajax_url}?action=revo_hotels_maps_fetch&lang=${revoHotelsMaps.lang}`)
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

            generateDropdownOptions(allHotels);
            renderMarkers(allHotels);
            checkParams();
            updateGridViewBtn();
        });
}





// Get URL parameters as an object
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

// Check URL parameters and set input values accordingly
function checkParams() {
    const urlParams = getURLParams();
    if (urlParams && Object.keys(urlParams).length > 0 && Object.values(urlParams).some(v => v)) {
        console.log("URL parameters found:", urlParams);
        const { city, country, brand, parent_brand, object_type } = urlParams;

        if (city) document.getElementById('city-header').value = city;
        if (country) document.getElementById('country-header').value = country;
        if (brand) document.getElementById('brand-header').value = brand;
        if (parent_brand) document.getElementById('parent-brand-header').value = parent_brand;
        if (object_type) document.getElementById('object-type-header').value = object_type;

        filterMarkers();        // Your filtering function
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
    let basePath = window.location.pathname;
    if (basePath.endsWith('/maps/')) {
        basePath = basePath.slice(0, -6); // Remove exactly '/maps/'
    }

    // Append proper suffix
    if (objectType) {
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
    addParam('parent-brand-header', 'parent_brand');
    addParam('object-type-header', 'object_type');

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
    fillOptions('parent-brand-options', unique('parent_brand'));
    fillOptions('brand-options', unique('brand'));
    fillOptions('object-type-options', objectTypes);

}

// disable object type if no hotels are found
function disableObjectTypeIfNoHotels() {
    const optionsList = document.getElementById('object-type-options');
    const objectTypeInput = document.getElementById('object-type-header');

    if (!optionsList || !objectTypeInput) {
        console.warn("Missing 'object-type-options' list or 'object-type-header' input.");
        return;
    }

    const hasOptions = optionsList.querySelectorAll('li').length > 0;
    console.log("Has Object Type Options:", hasOptions);

    if (!hasOptions) {
        console.log("No hotels found, disabling object type input");
        objectTypeInput.disabled = true;
    } else {
        console.log("Hotels found, enabling object type input");
        objectTypeInput.disabled = false;
    }
}

// Dropdown visibility toggle on header click
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
    if (input) {
        input.value = "";
        pushToUrl();
    // remove all markers
    clearMarkers();
    // Reset map to default
    zoomOut();
    filterMarkers();
    }
}
// ZOOM Out
function zoomOut() {
    map.setCenter({ lat: 51, lng: 10 });
    map.setZoom(4);
}
// Reset ALL fields
const resetBtn = document.getElementById("btn-reset");
resetBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearAllFields();
    filterMarkers();
    updateResultMessage(allHotels.length, allHotels);
});

function clearAllFields() {
    // Clear all input fields
    allInputs.forEach(input => {    
        input.value = "";
    });
    // Clear URL parameters
    const params = new URLSearchParams(window.location.search); 
    params.delete('city');
    params.delete('country');
    params.delete('brand');
    params.delete('parent_brand');      
    params.delete('object_type');
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
    // rmove all markers
    clearMarkers();
    // Reset map to default
    zoomOut()
}

// Message Wrapper
function updateResultMessage(count, filteredHotels) {
    const wrapper = document.getElementById("message-wrapper");
    if (!wrapper) return;

    document.getElementById("message-wrapper").innerHTML = "";

    const messageContainer = document.createElement("div");
    messageContainer.id = "message-container";

    if (count === 0) {
        const img = document.createElement("img");
        img.src = "https://www.hrg-hotels.com/path/to/not-found-graphic.png"; // replace with actual path
        img.alt = "not found graphic";
        img.className = "not-found-graphic";

        const nfgDiv = document.createElement("div");
        nfgDiv.className = "nfg";
        nfgDiv.appendChild(img);

        messageContainer.innerHTML = `<div class="message-txt red">Keine Hotels gefunden</div>`;
        messageContainer.style.backgroundColor = "var(--awb-color5)";
        messageContainer.style.color = "white";

        wrapper.appendChild(messageContainer);
        wrapper.appendChild(nfgDiv);
    } else {
        let country = document.getElementById('country-header').value.trim();
        let city = document.getElementById('city-header').value.trim();
        let parentBrand = document.getElementById('parent-brand-header').value.trim();
        let brand = document.getElementById('brand-header').value.trim();
        let objectType = document.getElementById('object-type-header').value.trim();

        messageContainer.innerHTML = `
        <div class="message-txt green">
            <h4 id="message-headline">Ihre Auswahl: </h4>
            <div class="message-filter-result">
                <div class="result-title" id="title-country"><span class="txt-black">Land:</span><span class="txt-gray"> ${country}</span></div>
                <div class="result-title" id="title-city"><span class="txt-black">Stadt:</span><span class="txt-gray"> ${city}</span></div>
                <div class="result-title" id="title-parent-brand"><span class="txt-black">Franchise Partner:</span><span class="txt-gray"> ${parentBrand}</span></div>
                <div class="result-title" id="title-brand"><span class="txt-black">Marke:</span><span class="txt-gray"> ${brand}</span></div>
                <div class="result-title" id="title-object-type"><span class="txt-black">Object type:</span><span class="txt-gray"> ${objectType}</span></div>
            </div>
            <div><p class="result-message">Gefunden: <span class="txt-black"> ${count} </span> Hotels.</p></div>
        </div>`;

        wrapper.appendChild(messageContainer);
        updateMessageContainer();
    }
}

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
    if (document.getElementById("object-type-header").value.trim()) {
        document.getElementById("title-object-type")?.classList.add("show");
    }
    if (document.getElementById("parent-brand-header").value.trim()) {
        document.getElementById("title-parent-brand")?.classList.add("show");
    }
    if (document.getElementById("object-type-header").value.trim()) {
        document.getElementById("title-object-type")?.classList.add("show");
    }
    if (!document.getElementById("country-header").value 
    && !document.getElementById("city-header").value 
    && !document.getElementById("brand-header").value 
    && !document.getElementById("parent-brand-header").value
    && !document.getElementById("object-type-header").value) {
        document.getElementById("message-headline")?.style.setProperty("display", "none");
    }
}

function removeShowClass() {
    const ids = ['country', 'city', 'brand', 'parent-brand', 'object-type'];
    ids.forEach(id => {
        document.getElementById(`title-${id}`)?.classList.remove("show");
    });
}

//Expected filterMarkers implementation placeholder:
function filterMarkers() {
    const countryFilter = document.getElementById('country-header').value.trim().toLowerCase();
    const cityFilter = document.getElementById('city-header').value.trim().toLowerCase();
    const brandFilter = document.getElementById('brand-header').value.trim().toLowerCase();
    const objectTypeFilter = document.getElementById('object-type-header').value.trim().toLowerCase();
    const parentBrandFilter = document.getElementById('parent-brand-header').value.trim().toLowerCase();

    const filtered = allHotels.filter(hotel => {
        const matchCountry = !countryFilter || hotel.country.toLowerCase().includes(countryFilter);
        const matchCity = !cityFilter || hotel.city.toLowerCase().includes(cityFilter) || hotel.county_town.toLowerCase().includes(cityFilter);
        const matchBrand = !brandFilter || hotel.brand.toLowerCase().includes(brandFilter);
        const matchObjectType = !objectTypeFilter || hotel.object_type.toLowerCase().includes(objectTypeFilter);
        const matchParentBrand = !parentBrandFilter || hotel.parent_brand.toLowerCase().includes(parentBrandFilter);
        return matchCountry && matchCity && matchBrand && matchParentBrand&& matchObjectType;
    });

    console.log('Filtered Hotels:', filtered);
    renderMarkers(filtered); // Your rendering logic
    generateDropdownOptions(filtered);
    disableObjectTypeIfNoHotels(); // Disable object type if no hotels are found
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

function createPopupContent(hotel) {
    const image = hotel.image || defaultHotelImage;
    return `
        <div class="popWrap">
            <img src="${image}" class="hotelImg" style="width:30%;height:auto;object-fit:cover;">
            <div class="contTxt">
                <h3 class="hotelHead">${hotel.name}</h3>
                <p>${hotel.street}, ${hotel.zip} ${hotel.city}</p>
                <p><strong>Telefon:</strong> ${hotel.phone}</p>
                <p><strong>Email:</strong> ${hotel.email}</p>
                <div class="btnWrap">
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
        </div>
    `;
}
