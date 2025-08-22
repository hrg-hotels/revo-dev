import $ from 'jquery';
import { pushArgToURL } from "./pushArgToURL";

export function handleEvent() {
    $(".nfg").remove();
    let argObj = {};
    let jobtitle = $("#jobtitle-header").val().trim();
    let city = $("#city-header").val().trim();
    let department = $("#department-header").val().trim();
    let brand = $("#brand-header").val().trim();

    if (jobtitle!== "" && jobtitle !== undefined) {
        argObj["jobtitle"] = jobtitle;
    }
    if (brand !== "" && brand !== undefined) {
        argObj["brand"] = brand;
    }
    if (city !== "" && city !== undefined) {
        argObj["city"] = city;
    }
    if (department !== "" && department !== undefined) {
        argObj["department"] = department;
    }
    // 🔹 URL aktualisieren
    pushArgToURL(argObj);
}