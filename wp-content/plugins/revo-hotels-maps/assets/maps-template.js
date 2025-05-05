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
const defaultMarkerIcon = "https://www.hrg-hotels.com/hubfs/HR%20Group/Icons%20and%20Logos/HRG_Maps-Marker/HRG_maps_marker-1.svg";
const defaultHotelImage = "https://www.hrg-hotels.com/hubfs/HRG/Corporate%20Pages/Portfolio/Hotel-Images/Platzhalter.jpg";

const brandIcons = {
    "Vienna House by Wyndham": { url: "https://www.hrg-hotels.com/hubfs/HRG_Maps-Marker/vienna_house_marker.png" },
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
            bindDropdownListeners();
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
document.querySelectorAll(".select-options").forEach(el => el.style.display = "none");

allHotels = []; // make sure this is assigned when data loads

function generateDropdownOptions(hotels) {
    const unique = key =>
        [...new Set(hotels.map(h => h[key]).filter(Boolean).map(v => v.trim()))]
        .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));

    const fillOptions = (id, values) => {
        const list = document.getElementById(id);
        if (!list) return;
        list.innerHTML = values.map(v => `<li data-value="${v}">${v}</li>`).join('');
    };

    fillOptions('city-options', unique('city'));
    fillOptions('brand-options', unique('brand'));
}

function setupDropdown(headerId, optionsId) {
    const header = document.getElementById(headerId);
    const options = document.getElementById(optionsId);

    if (!header.nextElementSibling || !header.nextElementSibling.classList.contains("clear-button")) {
        const btn = document.createElement('button');
        btn.className = 'clear-button';
        btn.textContent = '✕';
        btn.setAttribute('data-input', headerId);
        header.insertAdjacentElement('afterend', btn);
    }

    header.addEventListener("click", function (e) {
        e.stopPropagation();
        document.querySelectorAll(".select-options").forEach(el => {
            if (el !== options) el.style.display = "none";
        });
        options.style.display = options.style.display === "block" ? "none" : "block";
    });

    header.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const children = options.querySelectorAll("li");
        let matchFound = false;

        children.forEach(li => {
            if (li.textContent.toLowerCase().startsWith(searchTerm)) {
                li.style.display = "block";
                matchFound = true;
            } else {
                li.style.display = "none";
            }
        });

        if (!matchFound) {
            if (!options.querySelector(".no-results")) {
                const noRes = document.createElement("li");
                noRes.className = "no-results";
                noRes.textContent = "Keine Ergebnisse gefunden";
                options.appendChild(noRes);
            }
        } else {
            const noRes = options.querySelector(".no-results");
            if (noRes) options.removeChild(noRes);
        }
        options.style.display = "block";
    });

    options.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            header.value = e.target.textContent;
            options.style.display = "none";
            filterMarkers();
        }
    });
}

// Clear-Button Event
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("clear-button")) {
        const inputId = e.target.getAttribute("data-input");
        document.getElementById(inputId).value = "";
        filterMarkers();
    }
});

let currentFocus = -1;
document.querySelectorAll(".select-header input").forEach(input => {
    input.addEventListener("keydown", function (e) {
        const optionsList = input.closest(".selection-hr").querySelector(".select-options");
        const allOptions = Array.from(optionsList.querySelectorAll("li"));
        const visibleOptions = allOptions.filter(li => li.offsetParent !== null);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (optionsList.style.display !== "block") {
                optionsList.style.display = "block";
                allOptions.forEach(li => li.style.display = "block");
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
            if (currentFocus > -1 && options[currentFocus]) {
                options[currentFocus].click();
            } else {
                filterMarkers();
                optionsList.style.display = "none";
            }
        }
    });
});

function highlightOption(options) {
    options.forEach(li => li.classList.remove("highlighted"));
    if (currentFocus >= 0 && currentFocus < options.length) {
        options[currentFocus].classList.add("highlighted");
    }
}

// Klick außerhalb schließt Dropdowns
document.addEventListener("click", function (e) {
    if (!e.target.closest(".selection-hr")) {
        document.querySelectorAll(".select-options").forEach(el => {
            el.style.display = "none";
            el.querySelectorAll("li").forEach(li => li.classList.remove("highlighted"));
        });
        currentFocus = -1;
    }
});

// Enter auf dem Dokument
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        filterMarkers();
        document.querySelectorAll(".select-options").forEach(el => el.style.display = "none");
    }
});

// Feldänderungen berücksichtigen
document.querySelectorAll("#city-header, #brand-header").forEach(input => {
    input.addEventListener("blur", function () {
        if (this.value.trim() !== "") {
            const value = this.value;
            this.readOnly = false;
            this.disabled = false;
            setTimeout(() => this.focus(), 100);
        }
    });
    input.addEventListener("change", function () {
        if (this.value.trim() !== "") {
            const value = this.value;
            this.readOnly = false;
            this.disabled = false;
            setTimeout(() => this.focus(), 100);
        }
    });
});

// Initialisiere nur City und Brand Dropdowns
setupDropdown("city-header", "city-options");
setupDropdown("brand-header", "brand-options");

// ✳️ Expected filterMarkers implementation placeholder:
function filterMarkers() {
    const cityFilter = document.getElementById('city-header').value.trim().toLowerCase();
    const brandFilter = document.getElementById('brand-header').value.trim().toLowerCase();

    const filtered = allHotels.filter(hotel => {
        const matchCity = !cityFilter || hotel.city.toLowerCase().includes(cityFilter);
        const matchBrand = !brandFilter || hotel.brand.toLowerCase().includes(brandFilter);
        return matchCity && matchBrand;
    });

    // Call your map marker rendering logic here...
    renderMarkers(filtered);

    // Update dropdowns to reflect current filtered list
    generateDropdownOptions(filtered);
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
