// assets/js/src/modules/render.js
import { getRenderHook } from '../dom';

export function clearJobList() {
  const hook = getRenderHook();
  if (!hook) return;
  hook.innerHTML = "";
}

export function renderList(resultJobArr) {
  //remove old job list
  clearJobList();
  const hook = document.getElementById("jobportal-container");
  for (let job of resultJobArr) {
    let jobItem = document.createElement("div");
    jobItem.classList.add("job-list-item");

    jobItem.innerHTML = `
                        <div class="job-header">
                            <h3>${job.title}</h3>
                        </div>
                        <div class="company-list-item">
                            <div class="comp-col2">
                                <p class="line-hight-160"><strong>${job.companyname}</strong></p>
                                <div class="item-location">
                                    <img src="${imgPath}location_on.svg" alt="icon location" class="search-icon list-loc-icon">
                                    <p class="line-hight-160 pd-cit">${job.city}, ${job.city}</p>
                                </div>
                            </div>
                        </div>
                        <div class="key-row">
                            <div class="key-container">
                                <p>${job.city}, ${job.country}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.careerlevels}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.employment_type}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.joblocation_type}</p>
                            </div>
                            <div class="key-container">
                                <p>${job.categories}</p>
                            </div>
                        </div>
                        <button class="det-btn btn btn-card btn-job">
                        <img src="${imgPath}arrow_black.svg" alt="arrow">
                        </button> 
                      `;

    hook.appendChild(jobItem);
  }
}

