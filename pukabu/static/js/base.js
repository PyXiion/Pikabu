import * as api from "./pikabu/api.mjs";
import { PikabuClient } from "./pikabu/client.mjs";

/** @type {HTMLElement} */
var main_elem;

/** @type {HTMLElement} */
var sidebar_elem;

/** @type {PikabuClient} */
var client = new PikabuClient();

async function init() {
  if (!api.checkApiKey())
    await api.fetchApiKey()
  
  await load_templates()

  main_elem = document.getElementById("main")
  sidebar_elem = document.getElementById("sidebar")

  window.main_elem = main_elem;
  window.sidebar_elem = sidebar_elem;

  let pukabu_inited_event = new Event('pukabu_inited')
  document.dispatchEvent(pukabu_inited_event)

  if (client.getId() == -1) {
    let subs = document.getElementById("header-menu-sub")
    subs.remove()
  }
}

let vote_process = false;
/**
 * 
 * @param {HTMLDivElement} elem 
 * @param {number} value 
 */
async function vote(elem, type, value) {
  if (vote_process || client.getId() == -1) return;

  let item_id = Number(elem.parentElement.getAttribute("voting-item-id"))
  let current_vote = Number(elem.parentElement.getAttribute("current-vote"))

  let new_vote = current_vote + value
  elem.parentElement.setAttribute('current-vote', new_vote)

  let resp = await api.vote(item_id, type, new_vote)
  
  // TODO check success

  vote_process = false
}

function onScroll() {

}

window.init = init;
window.vote = vote

window.client = client;

addEventListener("scroll", onScroll)