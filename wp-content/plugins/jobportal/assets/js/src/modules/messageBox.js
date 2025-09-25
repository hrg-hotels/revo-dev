import $ from 'jquery';
import { getState} from "../state";
import { clearJobList } from './render';


export function message() {      
const globalParams = getState().globalParams || {};
const allJobs = getState().fetchedJobs || [];
const resultLength = getState().resultJobArr.length || 0;
// translations and paths
const t = window.jobportalTranslations || {};

    $("#message-container").remove();
    $(".not-found-graphic").remove();

    let messageContainer = $("<div></div>");
                    messageContainer.attr("id", "message-container");

                    // if no hotels are found, display not found graphic
                    if (resultLength === 0) {
                    //clear job List
                    clearJobList();
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
                        <div class="message-txt red">"No Result"</div>  
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
                        <h3 id="message-headline" class="heading black">Your Selection:</h3>
                        <div class="message-filter-result">

                        <div class="result-title" id="title-jobtitle">
                            <span class="txt-black">Jobtitle:</span>
                            <span class="txt-gray">${globalParams.jobtitle || ''}</span>
                        </div>

                        <div class="result-title" id="title-country">
                            <span class="txt-black">${t.country}:</span>
                            <span class="txt-gray">${globalParams.country || ''}</span>
                        </div>

                        <div class="result-title" id="title-city">
                            <span class="txt-black">${t.city}:</span>
                            <span class="txt-gray">${globalParams.city || ''}</span>
                        </div>

                        <div class="result-title" id="title-department">
                            <span class="txt-black">${t.department}:</span>
                            <span class="txt-gray">${globalParams.department || ''}</span>
                        </div>

                        <div class="result-title" id="title-brand">
                            <span class="txt-black">${t.brand}:</span>
                            <span class="txt-gray">${globalParams.brand || ''}</span>
                        </div>

                        <!-- Extended Filter -->
                        <div class="result-title" id="title-careerlevels">
                            <span class="txt-black">${t.careerLevels}:</span>
                            <span class="txt-gray">${globalParams.careerlevels || ''}</span>
                        </div>

                        <div class="result-title" id="title-employment-type">
                            <span class="txt-black">${t.employmentType}:</span>
                            <span class="txt-gray">${globalParams['employment-type'] || ''}</span>
                        </div>

                        <div class="result-title" id="title-joblocation-type">
                            <span class="txt-black">${t.jobLocationType}:</span>
                            <span class="txt-gray">${globalParams['joblocation-type'] || ''}</span>
                        </div>

                        <div class="result-title" id="title-keywords">
                            <span class="txt-black">${t.keywords}:</span>
                            <span class="txt-gray">${globalParams.keyword ? globalParams.keyword.split(',').join(', ') : ''}</span>
                        </div>

                        </div>

                        <div>
                        <p class="result-message">
                            <span class="txt-black">${resultLength}</span> ${t.openPositions}.
                        </p>
                        </div>
                    </div>
                    `);

                    
                    $("#message-wrapper").append(messageContainer);
                    if (resultLength === allJobs.length) { 
                        $(".result-message").html(`<span class="heading black">${resultLength} ${t.openPositions}</span>`);
                    }
                    updateMessageContainer();
                    }
                }
 function updateMessageContainer() {
  const globalParams = getState().globalParams || {};

  // alle .show-Klassen zurücksetzen
  removeShowClass();

  // Headline ein-/ausblenden
  if (!globalParams || Object.keys(globalParams).length === 0) {
    $('#message-headline').css('display', 'none');
  } else {
    $('#message-headline').css('display', '');
  }

  // Helper zum schnellen Prüfen
  const hasVal = v => v !== undefined && v !== null && String(v).trim() !== '';

  // Basis-Filter
  if (hasVal(globalParams.country) && globalParams.country !== 'Country') {
    $('#title-country').addClass('show');
  }
  if (hasVal(globalParams.city) && globalParams.city !== 'City') {
    $('#title-city').addClass('show');
  }
  if (hasVal(globalParams.brand) && globalParams.brand !== 'Brand') {
    $('#title-brand').addClass('show');
  }
  if (hasVal(globalParams.jobtitle) && globalParams.jobtitle !== 'jobtitle') {
    $('#title-jobtitle').addClass('show');
  }
  if (hasVal(globalParams.department) && globalParams.department !== 'Department') {
    $('#title-department').addClass('show');
  }

  // Extended-Filter
  if (hasVal(globalParams.careerlevels)) {
    $('#title-careerlevels').addClass('show');
  }
  if (hasVal(globalParams['employment-type'])) {
    $('#title-employment-type').addClass('show');
  }
  if (hasVal(globalParams['joblocation-type'])) {
    $('#title-joblocation-type').addClass('show');
  }
  if (hasVal(globalParams.keyword)) {
    $('#title-keywords').addClass('show');
  }
}

// remove show class from message elements
export function removeShowClass() {
  // alle möglichen Titel-IDs hier aufführen
  const messageTitleIds = [
    'country',
    'city',
    'brand',
    'department',
    'jobtitle',
    'careerlevels',
    'employment-type',
    'joblocation-type',
    'keywords'
  ];

  messageTitleIds.forEach(key => {
    $(`#title-${key}`).removeClass('show');
  });
}