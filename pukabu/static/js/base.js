import * as api from "./pikabu/api.mjs";

/** @type {HTMLElement} */
var main_elem;

async function init() {
  if (!api.checkApiKey())
    await api.fetchApiKey()
  
  await load_templates()

  main_elem = document.getElementById("main")

  window.main_elem = main_elem;
}

window.init = init;