
import $ from 'jquery';
import { handleEvent } from "../handleEvent";
import { getState } from '../state';
import { checkParams } from '../checkParams';

export function generateDropdownOptions() {
    let localResultJobArr = getState().resultJobArr;
    const getUniqueSortedValues = (key) => {
    return [...new Set(localResultJobArr.map(h => h[key]).filter(Boolean))].sort();
    };

    const jobtitle = getUniqueSortedValues('title');
    const cities = getUniqueSortedValues('city');
    const brand = getUniqueSortedValues('companyname');
    const department = getUniqueSortedValues('department');
    const country = getUniqueSortedValues('country');

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

    // Populiere Dropdowns
    populateDropdown("jobtitle-options", jobtitle);
    populateDropdown("country-options", country);
    populateDropdown("city-options", cities);
    populateDropdown("brand-options", brand);
    populateDropdown("department-options", department);

}

// Verstecke die Dropdown-Optionen initial
$(".select-options").hide(); 

export function setupDropdown(headerId, optionsId) {
    const header = $("#" + headerId);
    const options = $("#" + optionsId);

    // Falls der Clear-Button noch nicht existiert, füge ihn hinzu
        if (!header.siblings(".clear-button").length) {
        header.after(`<button class="clear-button" data-input="${headerId}">✕</button>`);
    }

    // Öffnen/Schließen der Dropdown-Optionen
        header.on("click", function (e) {
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

    // Dropdown offen halten, wenn Ergebnisse vorhanden sind
        options.slideDown();
    });

    // Auswahl einer Option
    options.on("click", "li", function (e) {
        e.stopPropagation(); 
        header.val($(this).text());
        options.slideUp();
    });
}

setupDropdown("jobtitle-header", "jobtitle-options");
setupDropdown("city-header", "city-options");
setupDropdown("country-header", "country-options");
// setupDropdown("category-header", "category-options");
setupDropdown("brand-header", "brand-options");
setupDropdown("department-header", "department-options");

// Event-Listener für den Löschen-Button
$(document).on("click", ".clear-button", function () {
    const inputId = $(this).data("input");
    $("#" + inputId).val(""); // Leert das Input-Feld
    handleEvent(); // Aktualisiert die Suche
});

// INPUT-SUGGESTION & LIVE-FILTERUNG FÜR ALLE DROPDOWNS
let currentFocus = -1;
$(".select-header input").on("input", function () {

    checkParams();
    
    const input = $(this);
    const filter = input.val().toLowerCase();
    const optionsList = input.closest(".selection-hr").find(".select-options");
    const allOptions = optionsList.find("li");

    optionsList.slideDown();               // ✅ Dropdown immer öffnen, wenn der Benutzer tippt
    currentFocus = -1;                     // Reset des Fokus
    allOptions.removeClass("highlighted"); // Entferne alte Hervorhebungen

    if (filter === "") {
        allOptions.show();                // ✅ Alle Optionen anzeigen, wenn das Eingabefeld leer ist
        return;
    }

    // ✅ Optionen filtern basierend auf der Eingabe
    allOptions.each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(filter));  // Zeige nur passende Optionen
    });

    // ✅ Dropdown schließen, wenn keine Optionen übrig sind
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
        // ✅ Wenn eine Option ausgewählt ist, löse das Click-Event aus
        options.eq(currentFocus).trigger("click");
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
$("#jobtitle-header, #city-header, #brand-header","#department-header", "#country-header")
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

