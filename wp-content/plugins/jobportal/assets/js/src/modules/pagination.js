import $ from 'jquery';
import { renderList } from "./render";
import { getState, setSplittResult, setPagination } from "../state";

//SPLIT RESULT TO SITE OBJECTS FOR PAGINATION
export function splittArray() {
    const localResultJobArr = getState().resultJobArr;

    let startIdx = 0;
    let pageNumber = 1;
    const newSplittResult = [];

    while (startIdx < localResultJobArr.length) {
        let endIdx = startIdx + 6;
        let pageArray = localResultJobArr.slice(startIdx, endIdx);
        newSplittResult.push({ pageNumber, pageArray });
        startIdx = endIdx;
        pageNumber++;
    }

    // im State speichern
    setSplittResult(newSplittResult);

    // Pagination im State zurücksetzen
    setPagination({
        currentPageNumber: 1,
        prevPageNumber: 0,
        nextPageNumber: 2
    });

    renderList(newSplittResult[0]?.pageArray || []);
    updatePagination();
}

//UPDATE PAGINATION ELEMENTS
function updatePagination() {
    const { currentPageNumber, prevPageNumber, nextPageNumber, splittResult } = getState();

    $("#current-page").text(currentPageNumber);
    $("#prev-page").text(prevPageNumber);
    $("#next-page").text(nextPageNumber);

    if (prevPageNumber === 0) {
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
$(".arrow-pag").on("click", (event) => {
    const { currentPageNumber, splittResult } = getState();

    if ($(event.currentTarget).hasClass("pleft")) {
        if (currentPageNumber > 1) {
            setPagination({
                currentPageNumber: currentPageNumber - 1,
                prevPageNumber: currentPageNumber - 2,
                nextPageNumber: currentPageNumber
            });
            renderList(splittResult[getState().currentPageNumber - 1].pageArray);
            updatePagination();
            $('html, body').animate({ scrollTop: $('#scroll-link').offset().top }, 100);
        }
    } else {
        if (splittResult.length > currentPageNumber) {
            setPagination({
                currentPageNumber: currentPageNumber + 1,
                prevPageNumber: currentPageNumber,
                nextPageNumber: currentPageNumber + 2
            });
            renderList(splittResult[getState().currentPageNumber - 1].pageArray);
            updatePagination();
            $('html, body').animate({ scrollTop: $('#scroll-link').offset().top }, 100);
        }
    }
});
