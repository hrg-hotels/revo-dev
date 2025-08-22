import $ from 'jquery';
import { renderList } from "./render";

let splittResult = [];
let current= 1;
let prev= 0;
let next= 2;
let currentPageNumber = 1;
let prevPageNumber = 0;
let nextPageNumber = 2;
//SPLIT RESULT TO SITE OBJECTS FOR PAGINATION
export function splittArray(resOrigin) {
    splittResult = [];
    currentPageNumber = 1;
    prevPageNumber = 0;
    nextPageNumber = 2;
    let startIdx = 0;
    let pageNumber = 1;
    while (startIdx < resOrigin.length) {
        let endIdx = startIdx + 6;
        let pageArray = resOrigin.slice(startIdx, endIdx);
        splittResult.push({ pageNumber, pageArray });
        startIdx = endIdx;
        pageNumber++;
    }
    renderList(splittResult[0].pageArray);
    updatePagination();
    // updateMapViewBtn();
    console.log("splittResult", splittResult);
}
//UPDATE PAGINATION ELEMENTS
export function updatePagination() {
    $("#current-page").text(currentPageNumber);
    $("#prev-page").text(prevPageNumber);
    $("#next-page").text(nextPageNumber);
    if (prevPageNumber == 0) {
    $(".pleft").css("display", "none");
    $("#prev-page").text(" ").css("background-color", "transparent");
    } else {
    $(".pleft").css("display", "flex");
    $("#prev-page").css("background-color", "white");
    }
    if (nextPageNumber > splittResult.length) {
    $(".pright, #next-page").css("display", "none");
    $("#next-page").text(" ").css("background-color", "transparent");
    } else {
    $(".pright").css("display", "flex");
    $("#next-page").css("background-color", "white");
    }
    if (splittResult.length < 2) {
    $("#prev-page, #next-page").css("display", "none");
    } else {
    $("#prev-page, #next-page").css("display", "block");
    }
}
//buttons pagination
$(".arrow-pag").click((event) => {
    //left arrow
    if ($(event.currentTarget).hasClass("pleft")) {
    if (currentPageNumber > 1) {
        currentPageNumber--;
        prevPageNumber = currentPageNumber - 1;
        nextPageNumber = currentPageNumber + 1;
        renderList(splittResult[currentPageNumber - 1].pageArray);
        updatePagination();
        $('html, body').animate({ scrollTop: $('#scroll-link').offset().top },100);
    } else {
        return;
    }
    }
    //right arrow
    else {
    if (splittResult.length > currentPageNumber) {
        currentPageNumber++;
        prevPageNumber = currentPageNumber - 1;
        nextPageNumber = currentPageNumber + 1;
        renderList(splittResult[currentPageNumber - 1].pageArray);
        updatePagination();
        $('html, body').animate({ scrollTop: $('#scroll-link').offset().top }, 100);
    } else {
        return;
    }
    }
});
