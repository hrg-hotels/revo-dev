
import $ from 'jquery';
import { getState, setFetchedJobs } from './state';
import { checkParams } from "./checkParams";
import { initAccordion } from './modules/extended-filter';
import { initUIHelpers } from './ui-helper';
import '../../css/src/index.css';

(function($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initAccordion();
    initUIHelpers();    
    $('#extended-filter').insertBefore('#message-wrapper');
 
    // Prüfen, ob "/de/" in der URL enthalten ist
    const lang = window.location.pathname.includes('/de/') ? 'de' : 'en';

    fetch(jobPortal.ajaxurl + `?action=jobportal_fetch&lang=${lang}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setFetchedJobs(data.data);
                checkParams();
            } else {
                console.error("Fehler beim Abrufen der Job-Daten:", data);
            }
        })
        .catch(error => console.error("Fetch-Fehler:", error));
  });

})(jQuery);
