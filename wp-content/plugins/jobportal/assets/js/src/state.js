// assets/js/src/state.js
const state = {
  fetchedJobs: [],
  resultJobArr: [],
  urlParams: "",
  globalParams: {},

  selections: {
    city: "",
    jobtitle: "",
    brand: "",
    department: ""
  }
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

export const setGlobalParams = (obj) => {
  state.globalParams = obj || {};
};

export const setPagination = (patch) => {
  state.pagination = { ...state.pagination, ...patch };
};