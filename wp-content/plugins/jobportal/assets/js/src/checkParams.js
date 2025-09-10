// assets/js/src/modules/checkParams.js
import { getState, setResultJobs, setGlobalParams } from './state';
import { generateDropdownOptions } from './modules/dropdowns';
import { splittArray } from './modules/pagination';
import { message } from './modules/messageBox';
import { getParameter } from './getParameter';


export function checkParams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.toString()) {
    console.log('No URL parameters found 1', getState().resultJobArr);
    setResultJobs(getState().fetchedJobs);
    setGlobalParams({});
    generateDropdownOptions();
    splittArray();
    message();
    console.log('No URL parameters found 2', getState().resultJobArr);
  } else {
    getParameter();
    console.log('URL parameters found', getState().resultJobArr);
  }
}