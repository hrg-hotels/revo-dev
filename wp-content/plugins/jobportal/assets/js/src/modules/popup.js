import $ from 'jquery';
import { getRenderHook } from '../dom';
//Open Job
export function openJob(job, jobListItem) {
  $("#current-job").removeAttr("id");
  $(".layer").remove();
  $("body").css("overflow", "hidden");
  jobListItem.setAttribute("id", "current-job");
  
  // Get the current URL
  let url = window.location.href;

  // Check if the URL already has query parameters
  let newUrl;
  if (url.indexOf('?') > -1) {
      // If parameters exist, use '&'
      newUrl = url + "&reference_id=" + job.reference_id;
  } else {
      // If no parameters, use '?'
      newUrl = url + "?reference_id=" + job.reference_id;
  }

  // Push the new URL to the history
  window.history.pushState({ path: newUrl }, "", newUrl);

  renderJobDetails(job);
}

  //Render Job Details
  function renderJobDetails(job) {
    if (job.images_header0 == "" || job.images_header0 == null) {
      job.images_header0 =
        "https://www.hrg-hotels.com/hubfs/Website/_global%20assets/header/Jobportal/jobs_default_header_img.jpg";
    };

  //Create pop-up and append to clicked job
    let popUp = document.createElement("div");
    popUp.classList.add("pop-up");
    popUp.innerHTML = `
    <div class="pop-up-window">
        <span class="close" style="position: absolute; z-index: 5000;">&times;</span>
        <div class="pop-header">
          <!---  <div class="pop-logo">
            <img src="${job.brand_url}" 
            >
            </div>--->
            <div class="pop-title">
                <h3 class="heading">${job.title}</h3>
                <p class="mt-10 heading-small">${job.companyname}</p>
                <div class="pop-key-wrap">
                  <div class="key-container">
                      <p>${job.employment_type}</p>
                  </div>
                  <div class="key-container">
                      <p>${job.careerlevels}</p>
                  </div>
                  <div class="key-container">
                      <p>${job.joblocation_type}</p>
                  </div>
                  <div class="key-container">
                    <p>${job.categories}</p>
                  </div>
                </div>
            </div>

        </div>
        <div class="pop-content">
            <div class="pop-col-01">
                <div class="pop-header-image">
                  <img src="${job.images_header0}" 
                  alt="job header image" 
                  style="width: -webkit-fill-available;">
                </div>
                <div class="cont-pop description">${job.description}</div>
                <div class="cont-pop tasks">${job.tasks}</div>
                <div class="cont-pop requirement">${job.requirement_content}</div>
                <div class="cont-pop offer">${job.offer}</div>
            </div>
            <div class="pop-col-02">            
                <div class="pop-card">
                    <div class="col-1-2">
                        <div style="font-size: 12px;">
                            <div class="w-100">
                                 <img src="${imgPath}map.svg" class="icon-26" alt="map"> 
                            </div>
                            <strong>Adresseeee</strong><br>
                            <div class="color-dark-gray">
                                ${job.companyname}<br>
                                ${job.street} ${job.buildingnumber}<br>
                                ${job.postalcode} ${job.city}<br>
                                ${job.country}
                            </div>
                        </div>
                    </div>
                    <div class="col-1-2">
                        <div style="font-size: 12px;">
                        <div class="w-100">
                           <img src="${imgPath}account_circle.svg" class="icon-26" alt="circle"> 
                        </div>
                            <strong>contactPerson</strong><br>
                            ${job.recruiter_firstname} ${job.recruiter_lastname}
                        </div>
                    </div>
                </div>

                <div class="pop-card flex-col">
                    <span  class="font-12"><strong>jobOverview</strong></span>
                    <div class="row">
                        <div class="col-1-2">
                            <img src="${imgPath}work.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Scope:</span>
                            <span class="font-12"><strong>${job.categories}</strong></span>
                        </div>
                        <div class="col-1-2">
                            <img src="${imgPath}layers.svg" class="icon-26" alt="icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Level:</span>
                            <span class="font-12"><strong>${job.careerlevels}</strong></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1-2">
                            <img src="${imgPath}avg_pace.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Employment Form:</span>
                            <span class="font-12"><strong>${job.employment_type}</strong></span>
                        </div>
                        <div class="col-1-2">
                            <img src="${imgPath}location_away.svg" class="icon-26" alt="work-icon"> 
                            <span class="color-dark-gray font-12 m-t-5">Joblocation Type:</span>
                            <span class="font-12"><strong>${job.joblocation_type}</strong></span>
                        </div>
                    </div>
                </div> 
                <div class="pop-card border-top flex-col">
                    <div class="row">
                        <span class="font-12"><strong>Follow us</strong></span>
                    </div>
                    <div class="row">
                        <a href="https://www.linkedin.com/company/hotels-by-hr-gmbh/mycompany/" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_linkedin.png" class="icon-20" alt="icon linkedIn">
                        </a>
                        <a href="https://www.xing.com/pages/hrghotelsgmbh" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_xing.png" class="icon-20" alt="icon xing">
                        </a>
                        <a href="https://www.facebook.com/HRGroup.Hotels" target=“_blank“ rel=“noopener“ class="btn-social">
                          <img src="${imgPath}icon_facebook.png" class="icon-20" alt="icon facebook">
                        </a>
                        <a href="https://www.youtube.com/channel/UCUP45iVsv0K4ie7u5BqY_PQ" target=“_blank“ rel=“noopener“ class="btn-social" >
                           <img src="${imgPath}icon_youtube.png" class="icon-20" alt="icon youtube">
                        </a>
                        <a href="https://www.instagram.com/hrg.community/" target=“_blank“ rel=“noopener“ class="btn-social" >
                          <img src="${imgPath}icon_insta.png" class="icon-20" alt="icon instagram">
                       </a>
                       <a href="https://www.tiktok.com/@hrg.hotels" target=“_blank“ rel=“noopener“ class="btn-social" >
                          <img src="${imgPath}icon_tiktok.png" class="icon-20" alt="icon tiktok">
                        </a>
                    </div>
                    
                    <div class="row">
                      <div class="apply-btn-wrap">
                        <div class="apply-item">
                          <a class="btn btn-apply m-b-0" target="_blank" rel="noopener nofollow" href="">apply!</a>
                        </div>
                        <div class="apply-item">
                          <a href="https://of-hrg-hotels.pitchyou.de/go/${job.reference_id}" target=“_blank“ rel=“noopener“>
                            <img src="${imgPath}icon_whatsapp.png" class="whatsapp-icon" alt="icon">
                          </a>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>   
        <div class="row">
        <div class="btn-bottom-desktop">

        </div>
    </div>
    </div>
    `;
  //append to current job
  let currentEl = document.getElementById("current-job");
  currentEl.appendChild(popUp);

  popUp.style.display = "block";

  //Create layer and append to body
  let layer = document.createElement("div");
  layer.classList.add("layer");
  getRenderHook().appendChild(layer);

  // Close-Funktion
  function closePopup() {
    const url = window.location.href;
    const newUrl = url.split("&reference_id")[0];
    window.history.pushState({ path: newUrl }, "", newUrl);
    $(".pop-up").remove();
    $(currentEl).removeAttr("id");
    $(".layer").remove();
    $("body").css("overflow", "auto");
  }

  // Layer-Klick -> schließen
  layer.addEventListener("click", closePopup);

  // *** WICHTIG: Listener am Popup-Element suchen ***
  const closeBtn = popUp.querySelector(".close");
  if (closeBtn) {
    closeBtn.style.cssText += "top:8px;right:8px;cursor:pointer;"; // optional
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopup();
    });
  }
}