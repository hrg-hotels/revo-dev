const dom = {
  renderHook: null,
  jobPortalWrapper: document.getElementById("jobportal-wrapper"),
  extendedFilterHook: document.getElementById("extended-filter")
};

export function initDom() {
  dom.renderHook = document.getElementById("jobportal-container");
}

export function getRenderHook() {
  return dom.renderHook;
}

export function getJobPortalWrapper() {
  return dom.jobPortalWrapper;
}

export function getExtendedFilterHook() {
  return dom.extendedFilterHook;
}
