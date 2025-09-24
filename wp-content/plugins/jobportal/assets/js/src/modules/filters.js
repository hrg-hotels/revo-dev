// assets/js/src/modules/filters.js
import { setResultJobs, getState } from '../state';
import { splittArray } from './pagination';
import { generateDropdownOptions } from './dropdowns';
import { message } from './messageBox';

export function filterListByParams() {
  const params = getState().globalParams || {};
  const fetchedJobs = getState().fetchedJobs || [];
  const out = [];

  for (const job of fetchedJobs) {
    let ok = true;

    if (params.city?.trim()       && !job.city?.toLowerCase().includes(params.city.trim().toLowerCase())) ok = false;
    if (params.brand?.trim()      && !job.brand?.toLowerCase().includes(params.brand.trim().toLowerCase())) ok = false;
    if (params.department?.trim() && !job.department?.toLowerCase().includes(params.department.trim().toLowerCase())) ok = false;
    if (params.jobtitle?.trim()   && !job.title?.toLowerCase().includes(params.jobtitle.trim().toLowerCase())) ok = false;

    if (params.careerlevels?.trim()        && !job.careerlevels?.toLowerCase().includes(params.careerlevels.trim().toLowerCase())) ok = false;
    if (params['employment-type']?.trim()  && !job.employment_type?.toLowerCase().includes(params['employment-type'].trim().toLowerCase())) ok = false;
    if (params['joblocation-type']?.trim() && !job.joblocation_type?.toLowerCase().includes(params['joblocation-type'].trim().toLowerCase())) ok = false;

    if (params.keyword?.trim()) {
      const selected = params.keyword.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const jobKeywords = Array.isArray(job.keywords)
        ? job.keywords.map(k => String(k).toLowerCase())
        : String(job.keywords || '').toLowerCase().split(',').map(s => s.trim());
      const allMatch = selected.every(kw => jobKeywords.some(jk => jk.includes(kw)));
      if (!allMatch) ok = false;
    }

    if (ok) out.push(job);
  }

  generateDropdownOptions(out); // Update Dropdowns
  setResultJobs(out);
  message(); // Update Message Box

  // Downstream der Pipeline:
  // - splittArray erzeugt Seiten + ruft renderList(pageArray) SELBST
  splittArray();// this function create an object with pages you can find it in pagination.js

}
