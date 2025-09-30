// assets/js/src/state.js

const state = {
  fetchedJobs: [],
  resultJobArr: [],
  urlParams: "",
  globalParams: {},
  reference_id:"",

  selections: {
    city: "",
    country: "",
    jobtitle: "",
    brand: "",
    department: ""
  },

  currentPageNumber: 1,
  prevPageNumber: 0,
  nextPageNumber: 2,
  // splittResult: [],s
};

// Getter
export const getState = () => state;

// Setter
export const setFetchedJobs = (list) => {
  state.fetchedJobs = Array.isArray(list) ? list : [];
};

export const setResultJobs = (list) => {
  state.resultJobArr = Array.isArray(list) ? [...list] : [];
};

export const setSplittResult = (list) => {
  state.splittResult = Array.isArray(list) ? [...list] : [];
};

export const setGlobalParams = (obj) => {
  state.globalParams = obj || {};
};
export const setReferenceId = (str) => {
  state.reference_id = str || "";
};

export const setPagination = (patch) => {
  state.currentPageNumber = patch.currentPageNumber ?? state.currentPageNumber;
  state.prevPageNumber = patch.prevPageNumber ?? state.prevPageNumber;
  state.nextPageNumber = patch.nextPageNumber ?? state.nextPageNumber;
};
