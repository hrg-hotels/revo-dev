const dom = {
  renderHook: null
};

export function initDom() {
  dom.renderHook = document.getElementById("jobportal-container");
}

export function getRenderHook() {
  return dom.renderHook;
}
