import { setResultJobs, getState, setGlobalParams } from '../state';
import { splittArray } from "./pagination";
import { generateDropdownOptions } from "./dropdowns";
import { message } from './messageBox';

export function filterListByParams() {
    console.log("filterListByParams called");
    const params = getState().globalParams;
    setResultJobs([]);
    let localJobArr = [];
    console.log("Filtering jobs with params:", params);

    const fetchedJobs = getState().fetchedJobs;

    for (let job of fetchedJobs) {
    let matchesJobs = true;
    if (params.city?.trim().toLowerCase()) {
        if (!job.city?.toLowerCase().includes(params.city.trim().toLowerCase())) {
        matchesJobs = false;
        }
    }
    if (params.brand?.trim().toLowerCase()) {
        if (!job.brand?.toLowerCase().includes(params.brand.trim().toLowerCase())) {
        matchesJobs = false;
        }
    }
    if (params.department?.trim().toLowerCase()) {
        if (!job.department?.toLowerCase().includes(params.department.trim().toLowerCase())) {
        matchesJobs = false;
        }
    }
    if (params.jobtitle?.trim().toLowerCase()) {
        if (!job.title?.toLowerCase().includes(params.jobtitle.trim().toLowerCase())) {
        matchesJobs = false;
        }
    }
    if (matchesJobs) {
        localJobArr.push(job);
     }
    }
    console.log("Filtered jobs:", localJobArr);
    setResultJobs(localJobArr);

    let jobAmount = getState().resultJobArr.length;
    message(jobAmount);

    if (jobAmount > 0) {
        console.log("Jobs found, updating URL parameters");
        
        splittArray();
        generateDropdownOptions();
    } else {
        console.log("No jobs found, clearing URL parameters");
        window.history.pushState({}, document.title, window.location.pathname);
    }
}    
