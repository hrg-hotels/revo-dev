import $, { get } from 'jquery';
import { getRenderHook } from '../dom';
import { getState, setReferenceId } from '../state';
import { generateDropdownOptions } from './dropdowns';
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

  // Push the new URL to the history^
  if (!getState().reference_id ) {
  window.history.pushState({ path: newUrl }, "", newUrl);
  }
  renderJobDetails(job,jobListItem);

}

  //Render Job Details
  function renderJobDetails(job,jobListItem) {
    const t = window.jobportalTranslations || {};
    const _ = (k, d = '') => (t[k] ?? d); // helper: translation or default
    const imgPath = t.imgPath || (window.jobPortalAssetsPath || '/wp-content/plugins/jobportal/assets/img/'); // Fallback
    //job.apply_url bevorzugen, sonst PitchYou über reference_id
    const applyHref = job.apply_url && job.apply_url.trim()
      ? job.apply_url
      : `https://of-hrg-hotels.pitchyou.de/go/${encodeURIComponent(job.reference_id || '')}`;


    if (job.images_header0 == "" || job.images_header0 == null) {
      job.images_header0 =
        "https://www.hrg-hotels.com/hubfs/Website/_global%20assets/header/Jobportal/jobs_default_header_img.jpg";
    };

  //Create pop-up and append to clicked job
    let popUp = document.createElement("div");
    popUp.classList.add("pop-up");
   popUp.innerHTML = `
  <div class="pop-up-window">
    <button type="button" class="close" aria-label="Close" style="position:absolute;z-index:5000;">&times;</button>

    <div class="pop-header">
      <div class="pop-title">
        <h3 class="heading">${job.title ?? ''}</h3>
        <p class="mt-10 heading-small">${job.companyname ?? ''}</p>
        <div class="pop-key-wrap">
          <div class="key-container"><p>${job.employment_type ?? ''}</p></div>
          <div class="key-container"><p>${job.careerlevels ?? ''}</p></div>
          <div class="key-container"><p>${job.joblocation_type ?? ''}</p></div>
          <div class="key-container"><p>${job.categories ?? ''}</p></div>
        </div>
      </div>
    </div>

    <div class="pop-content">
      <div class="pop-col-01">
        <div class="pop-header-image">
          ${job.images_header0 ? `
            <img src="${job.images_header0}" alt="header" style="width:-webkit-fill-available;">
          ` : ''}
        </div>

        ${job.description ? `<div class="cont-pop description">${job.description}</div>` : ''}
        ${job.tasks ? `<div class="cont-pop tasks">${job.tasks}</div>` : ''}
        ${job.requirement_content ? `<div class="cont-pop requirement">${job.requirement_content}</div>` : ''}
        ${job.offer ? `<div class="cont-pop offer">${job.offer}</div>` : ''}
      </div>

      <div class="pop-col-02">
        <!-- Address card -->
        <div class="pop-card">
          <div class="col-1-2">
            <div>
              <div class="w-100">
                <img src="${imgPath}map.svg" class="icon-26" alt="map">
              </div>
              <h3 class="heading mb-20">${t.address}</h3>
              <div>
                ${job.companyname ?? ''}<br>
                ${(job.location_streetname || job.street || '')} ${(job.location_buildingnumber || job.buildingnumber || '')}<br>
                ${(job.location_postalcode || job.postalcode || '')} ${(job.city || '')}<br>
                ${(job.country || '')}
              </div>
            </div>
          </div>

          <div class="col-1-2">
            <div>
              <div class="w-100">
                <img src="${imgPath}account_circle.svg" class="icon-26" alt="contact">
              </div>
              <h3 class="heading mb-20">${t.contactPerson}</h3>
              ${(job.recruiter_firstname || '')} ${(job.recruiter_lastname || '')}
            </div>
          </div>
        </div>

        <!-- Job overview -->
        <div class="pop-card flex-col">
          <div class="mb-20">
            <h3 class="heading">${t.jobOverview}</h3>
          </div>

          <div class="flex">
            <div class="col-1-2">
              <img src="${imgPath}work.svg" class="icon-26" alt="work">
              <span>${_('category','Category')}:</span>
              <span class="black"> ${job.categories ?? ''} </span>
            </div>
            <div class="col-1-2">
              <img src="${imgPath}layers.svg" class="icon-26" alt="level">
              <span >${_('career-levels','Career levels')}:</span>
              <span class="black"> ${job.careerlevels ?? ''} </span>
            </div>
          </div>

          <div class="flex mt-20">
            <div class="col-1-2">
              <img src="${imgPath}avg_pace.svg" class="icon-26" alt="employment">
              <span>${_('employment-type','Employment type')}:</span>
              <span class="black"> ${job.employment_type ?? ''} </span>
            </div>
            <div class="col-1-2">
              <img src="${imgPath}location_away.svg" class="icon-26" alt="location type">
              <span>${_('job-location-type','Job location type')}:</span>
              <span class="black"> ${job.joblocation_type ?? ''} </span>
            </div>
          </div>
        </div>

        <!-- Social + Apply -->
        <div class="pop-card border-top flex-col">
          <div class="mb-20">
            <h3 class="heading">${t.followUs}</h3>
          </div>

          <div class="flex">
            <a href="https://www.linkedin.com/company/hotels-by-hr-gmbh/mycompany/" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_linkedin.png" class="icon-20" alt="LinkedIn">
            </a>
            <a href="https://www.xing.com/pages/hrghotelsgmbh" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_xing.png" class="icon-20" alt="Xing">
            </a>
            <a href="https://www.facebook.com/HRGroup.Hotels" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_facebook.png" class="icon-20" alt="Facebook">
            </a>
            <a href="https://www.youtube.com/channel/UCUP45iVsv0K4ie7u5BqY_PQ" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_youtube.png" class="icon-20" alt="YouTube">
            </a>
            <a href="https://www.instagram.com/hrg.community/" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_insta.png" class="icon-20" alt="Instagram">
            </a>
            <a href="https://www.tiktok.com/@hrg.hotels" target="_blank" rel="noopener" class="btn-social">
              <img src="${imgPath}icon_tiktok.png" class="icon-20" alt="TikTok">
            </a>
          </div>

          <div class="mb-20 mt-20">
            <h3 class="heading">${t.applyNow}</h3>
          </div>

          <div class="apply-btn-wrap">
            <div class="apply-item">
              <a class="fusion-button button-flat fusion-button-default-size button-custom fusion-button-default button-2 fusion-button-default-span fusion-button-default-type"
                 target="_blank" rel="noopener nofollow" href="${applyHref}">
                ${t.applyNow}
              </a>
            </div>
            <div class="apply-item">
              <a href="https://of-hrg-hotels.pitchyou.de/go/${encodeURIComponent(job.reference_id || '')}" target="_blank" rel="noopener">
                <img src="${imgPath}icon_whatsapp.png" class="whatsapp-icon" alt="WhatsApp">
              </a>
            </div>
          </div>
        </div>
      </div> <!-- /pop-col-02 -->
    </div> <!-- /pop-content -->
  </div>
`;
  //append to current job

  jobListItem.appendChild(popUp);

  popUp.style.display = "block";

  //Create layer and append to body
  let layer = document.createElement("div");
  layer.classList.add("layer");
  getRenderHook().appendChild(layer);

  // Close-Funktion
function closePopup() {
  const url = new URL(window.location.href);

  // reference_id aus den Parametern löschen
  url.searchParams.delete("reference_id");

  // Wenn keine Params mehr übrig -> ? entfernen
  const newUrl =
    url.search && url.search.length > 1
      ? url.toString()
      : url.origin + url.pathname;

  // URL im Verlauf aktualisieren
  window.history.pushState({ path: newUrl }, "", newUrl);
  // ReferenceId im State zurücksetzen
  setReferenceId("");
  // generate dropdowns
  generateDropdownOptions();

  // UI zurücksetzen
  $(".pop-up").remove();
  $(jobListItem).removeAttr("id");
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