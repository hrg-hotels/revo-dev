// === GOOGLE MAPS LOADER with AVADA PRIVACY SUPPORT ===
function loadGoogleMapsAPI(callback) {
    if (window.google && window.google.maps) {
        if (typeof callback === "function") callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=' + callback.name + '&libraries=marker';
    script.id = 'google-maps-api-js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

if (typeof AvadaPrivacy !== 'undefined' && typeof AvadaPrivacy.registerScript === 'function') {
    AvadaPrivacy.registerScript({
        type: 'gmaps',
        src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrGUx-sWW3nkDEL0CRoUYvA0MS95VCMlY&callback=initRevoHotelsMap&libraries=marker',
        id: 'google-maps-api-js',
        async: true,
        defer: true
    });
} else {
    loadGoogleMapsAPI(initRevoHotelsMap);
}

// === GLOBALS ===
const defaultMarkerIcon = "http://localhost/hrgredesign/wp-content/uploads/2025/05/HRG_maps_marker.svg";
const defaultHotelImage = "https://www.hrg-hotels.com/hubfs/HRG/Corporate%20Pages/Portfolio/Hotel-Images/Platzhalter.jpg";

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

let map, markers = [], clusterer, allHotels = [];

// === MAIN MAP FUNCTION ===
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
                zoom: 5,
                mapId: "b7d66f7add83f786"
            });

            generateDropdownOptions(allHotels);
            renderMarkers(allHotels);
        });
}

// === CREATE MARKERS AND CLUSTER ===
function 


renderMarkers(hotels) {
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
                    filterMarkers();
                }
                list.style.display = "none";
            });
        });
    };

    fillOptions('country-options', unique('country'));
    fillOptions('city-options', unique('city'));
    fillOptions('parent-brand-options', unique('parent_brand'));
    fillOptions('brand-options', unique('brand'));
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
                filterMarkers();
                options.style.display = "none";
            } else {
                filterMarkers();
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

// Reset single field
function clearField(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = "";
        filterMarkers();
    }
}

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

// Reset ALL fields
const resetBtn = document.getElementById("btn-reset");
if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        ["country-header", "city-header", "parent-brand-header", "brand-header"].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = "";
        });
        filterMarkers();
    });
}

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

        messageContainer.innerHTML = `
        <div class="message-txt green">
            <h4 id="message-headline">Ihre Auswahl: </h4>
            <div class="message-filter-result">
                <div class="result-title" id="title-country"><span class="txt-black">Land:</span><span class="txt-gray"> ${country}</span></div>
                <div class="result-title" id="title-city"><span class="txt-black">Stadt:</span><span class="txt-gray"> ${city}</span></div>
                <div class="result-title" id="title-parent-brand"><span class="txt-black">Franchise Partner:</span><span class="txt-gray"> ${parentBrand}</span></div>
                <div class="result-title" id="title-brand"><span class="txt-black">Marke:</span><span class="txt-gray"> ${brand}</span></div>
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
    if (document.getElementById("parent-brand-header").value.trim()) {
        document.getElementById("title-parent-brand")?.classList.add("show");
    }
    if (!document.getElementById("country-header").value && !document.getElementById("city-header").value && !document.getElementById("brand-header").value && !document.getElementById("parent-brand-header").value) {
        document.getElementById("message-headline")?.style.setProperty("display", "none");
    }
}

function removeShowClass() {
    const ids = ['country', 'city', 'brand', 'parent-brand'];
    ids.forEach(id => {
        document.getElementById(`title-${id}`)?.classList.remove("show");
    });
}

// ✳️ Expected filterMarkers implementation placeholder:
function filterMarkers() {
    const countryFilter = document.getElementById('country-header').value.trim().toLowerCase();
    const cityFilter = document.getElementById('city-header').value.trim().toLowerCase();
    const brandFilter = document.getElementById('brand-header').value.trim().toLowerCase();
    const parentBrandFilter = document.getElementById('parent-brand-header').value.trim().toLowerCase();

    const filtered = allHotels.filter(hotel => {
        const matchCountry = !countryFilter || hotel.country.toLowerCase().includes(countryFilter);
        const matchCity = !cityFilter || hotel.city.toLowerCase().includes(cityFilter);
        const matchBrand = !brandFilter || hotel.brand.toLowerCase().includes(brandFilter);
        const matchParentBrand = !parentBrandFilter || hotel.parent_brand.toLowerCase().includes(parentBrandFilter);
        return matchCountry && matchCity && matchBrand && matchParentBrand;
    });

    renderMarkers(filtered); // Your rendering logic
    generateDropdownOptions(filtered);
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
                <h4 class="hotelHead">${hotel.name}</h4>
                <p><strong>Adresse:</strong><br>${hotel.street}, ${hotel.zip} ${hotel.city}</p>
                <p><strong>Telefon:</strong> ${hotel.phone}</p>
                <p><strong>Email:</strong> ${hotel.email}</p>
                <p><strong>Marke:</strong> ${hotel.brand}</p>
                <hr class="sep"/>
                <div class="btnWrap">
                    <button class="btn btn-card btn-select btnMaps">
                        <a href="${hotel.website}" target="_blank" style="text-decoration:none;color:white;">Details</a>
                    </button>
                </div>
            </div>
        </div>
    `;
}
