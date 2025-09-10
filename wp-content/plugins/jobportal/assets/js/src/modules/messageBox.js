import $ from 'jquery';
import { getState} from "../state";
import { clearJobList } from './render';


export function message() {      
const globalParams = getState().globalParams || {};
const allJobs = getState().fetchedJobs || [];
const resultLength = getState().resultJobArr.length || 0;
console.log("globalParams in message", globalParams);

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
                    
                    $("#message-wrapper").append(messageContainer);
                    if (resultLength === allJobs.length) { 
                        $(".result-message").html(`<span class="txt-black">Hotels:</span> ${resultLength}`);
                    }
                    updateMessageContainer();
                    }
                }
//update message container
 export function updateMessageContainer(){
    const globalParams = getState().globalParams || {};
    //remove show class from message elements
    removeShowClass();

    if (Object.keys(globalParams).length === 0) {
    $('#message-headline').css('display','none');
    }
    if (globalParams.country && globalParams.country !== "" && globalParams.country !== 'Country' && globalParams.country !== undefined) {
    $("#title-country").addClass("show");
    }
    if (globalParams.city && globalParams.city !== "" && globalParams.city !== 'City' && globalParams.city !== undefined) {
    $("#title-city").addClass("show");
    }
    if (globalParams.brand && globalParams.brand !== "" && globalParams.brand !=='Brand' && globalParams.brand !== undefined) {
    $("#title-brand").addClass("show");
    }
    if (globalParams.jobtitle && globalParams.jobtitle !== "" && globalParams.jobtitle !== 'jobtitle' && globalParams.jobtitle !== undefined) {
    $("#title-jobtitle").addClass("show");
    }
    if (globalParams.department && globalParams.department !== "" && globalParams.department !== 'Department' && globalParams.department !== undefined) {
    $("#title-department").addClass("show");
    }
}
//remove show class from message elements
export function removeShowClass(){
    let messageTitleArray = ['country', 'city', 'brand', 'department', 'jobtitle'];
    messageTitleArray.forEach((element) => {
    $(`#title-${element}`).removeClass("show");
    });
}