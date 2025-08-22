import $ from 'jquery';
import { filterListByParams } from "./modules/filters";
import { getState, setGlobalParams } from "./state";

export function getParameter() { 
    let params = {};
    let urlParams = new URLSearchParams(window.location.search);

    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    console.log("params", params);

    // Map between URL param names and input names
    if (params.jobtitle||params.country || params.city || params.brand || params.department) {
        // Set the values using input[name=...]
        $('.selection-hr input[name="jobtitle"]').val(params.jobtitle || '');
        //$('.selection-hr input[name="country"]').val(params.country || '');
        $('.selection-hr input[name="city"]').val(params.city || '');
        $('.selection-hr input[name="brand"]').val(params.brand || '');
        $('.selection-hr input[name="department"]').val(params.department || '');
    }

    setGlobalParams(params);
    console.log("globalParams", getState().globalParams);
    filterListByParams();
}