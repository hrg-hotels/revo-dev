import $ from 'jquery';
import { getRenderHook ,initDom} from '../dom';
import { getState } from '../state';

initDom();
let hook= getRenderHook();

export function clearJobList() {

  console.log("Clearing job list in hook:", hook);
  if (!hook) return;
  hook.innerHTML = "";
}

export function renderList(splittResult) {
    console.log("Rendering job list:", splittResult);
  //remove old job list
  clearJobList();

  for (let job of splittResult) {
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

