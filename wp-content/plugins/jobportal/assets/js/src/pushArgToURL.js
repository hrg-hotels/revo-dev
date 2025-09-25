import { checkParams } from "./checkParams";

export function pushArgToURL(argObj) {

    // Entferne das `#` aus der Basis-URL
    let baseUrl = window.location.href.split("?")[0].split("#")[0];

    let queryString = Object.keys(argObj)
    .map((key) => key + "=" + encodeURIComponent(argObj[key]))
    .join("&");

    let url = baseUrl;
    if (queryString) {
    url += "?" + queryString;
    }

    window.history.pushState({ path: url }, "", url);
    
    // pull parameters from URL and call filterListByParams
    checkParams();
}