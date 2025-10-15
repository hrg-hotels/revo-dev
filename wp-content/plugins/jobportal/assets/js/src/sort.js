// assets/js/src/modules/sort.js
import { getState, setResultJobs } from './state';
import { splittArray } from './modules/pagination';

/**
 * Sortiert die Jobs nach Veröffentlichungsdatum (published_at oder published_iso)
 * @param {boolean} ascending - true = älteste zuerst, false = neueste zuerst
 */
export function sortByDate(ascending = false) {
  let jobs = [...getState().resultJobArr];

  jobs.sort((a, b) => {
    const dateA = new Date(a.published_iso || a.published_at || 0);
    const dateB = new Date(b.published_iso || b.published_at || 0);
    return ascending ? dateA - dateB : dateB - dateA;
  });

  setResultJobs(jobs);
  splittArray(); // neu rendern
}

/**
 * Sortiert alphabetisch nach Jobtitel
 * @param {boolean} ascending - true = A→Z, false = Z→A
 */
export function sortAlphabetically(ascending = true) {
  let jobs = [...getState().resultJobArr];

  jobs.sort((a, b) => {
    const nameA = (a.title || '').toUpperCase();
    const nameB = (b.title || '').toUpperCase();

    if (nameA < nameB) return ascending ? -1 : 1;
    if (nameA > nameB) return ascending ? 1 : -1;
    return 0;
  });

  setResultJobs(jobs);
  splittArray(); // neu rendern
}
