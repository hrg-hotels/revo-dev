// assets/js/src/modules/checkParams.js
import { getState, setResultJobs, setGlobalParams } from './state';
import { generateDropdownOptions } from './modules/dropdowns';
import { splittArray } from './modules/pagination';
import { message } from './modules/messageBox';
import { getParameter } from './getParameter';


export function checkParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const { fetchedJobs: resJobArr } = getState();https://pullman-stuttgart.com/

  if (!urlParams.toString()) {
    // Arbeitsarray = Kopie der Originaldaten
    setResultJobs(resJobArr);
    setGlobalParams({});
    generateDropdownOptions(resJobArr);
    splittArray(resJobArr);
    message(resJobArr.length);
    console.log('No URL parameters found');
  } else {
    getParameter();
    console.log('URL parameters found');
  }
}