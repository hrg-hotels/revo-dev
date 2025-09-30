// assets/js/src/modules/render.js
import $, { get } from 'jquery';
import { getRenderHook, initDom } from '../dom';
import { openJob } from './popup';
import { getState } from '../state';

initDom();
let hook = getRenderHook();

export function clearJobList() {
  if (!hook) return;
  hook.innerHTML = '';
}

/**
 * Rendert die übergebene Seite (Array von Jobs).
 * KEIN State-Read hier; die Seite kommt aus pagination.splittArray().
 */
export function renderList(list = []) {
  if (!hook) return;

  clearJobList();

  if (!Array.isArray(list) || list.length === 0) return;

  for (let job of list) {
    const jobItem = document.createElement('div');
    jobItem.classList.add('job-list-item');

    jobItem.innerHTML = `
      <div class="job-header">
        <h3 class="heading">${job.title ?? ''}</h3>
      </div>
      <div class="company-list-item">
        <div class="comp-col2">
          <div class="card-jp-icons">
            <img src="${imgPath}rh-logo.png" alt="logo" class="search-icon list-loc-icon">
          </div>
          <h4 class="heading-small">${job.companyname ?? ''}</h4>
          <div class="card-jp-icons">
            <img src="${imgPath}location_on.svg" alt="icon location" class="search-icon" style="margin-right:10px;">
            <p>${job.city ?? ''}</p>
          </div>
        </div>
      </div>
      <div class="key-row">
        <div class="key-container"><p>${job.city ?? ''}, ${job.country ?? ''}</p></div>
        <div class="key-container"><p>${job.careerlevels ?? ''}</p></div>
        <div class="key-container"><p>${job.employment_type ?? ''}</p></div>
        <div class="key-container"><p>${job.joblocation_type ?? ''}</p></div>
        <div class="key-container"><p>${job.categories ?? ''}</p></div>
      </div>
    `;

    jobItem.addEventListener('click', () => openJob(job, jobItem));
    if (getState().reference_id === job.reference_id) {
      openJob(job, jobItem);
    }
    hook.appendChild(jobItem);
  }
}
