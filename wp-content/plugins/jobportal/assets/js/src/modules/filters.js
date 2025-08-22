import { setResultJobs, getState, setGlobalParams } from '../state';
import { splittArray } from "./pagination";
import { generateDropdownOptions } from "./dropdowns";
import { message } from './messageBox';

export function filterListByParams() {
    const params = getState().globalParams;
    setResultJobs([]);
    console.log("Filtering jobs with params:", params);

    const fetchedJobs = getState().fetchedJobs;

console.log("Fetched jobs:", fetchedJobs);
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
        setResultJobs(job);
        console.log("Job matches:", job);
    }
    }
    let resultJobArr = getState().resultJobArr;
    console.log("Filtered jobs:", resultJobArr);
    message(resultJobArr.length);

    if (resultJobArr.length > 0) {
    splittArray(resultJobArr);
    generateDropdownOptions(resultJobArr);
    } else {
    window.history.pushState({}, document.title, window.location.pathname);
    }
}    
