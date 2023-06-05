import * as api from "./pikabu/api.mjs";
import { PikabuClient } from "./pikabu/client.mjs";
import { htmlToElement } from "./utils.mjs"

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

  await get_settings()

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

/**
 * 
 * @param {HTMLElement} item 
 * @param {string} event 
 */
async function waitForEvent(item, event) {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve();
    }
    item.addEventListener(event, listener)
  })
}

let settings_opened = false;
async function ask_settings() {
  if (settings_opened) return;
  settings_opened = true

  let form = document.querySelector("body").appendChild(htmlToElement(templates.settings()))
  
  /** @type {HTMLButtonElement} */
  let button = form.querySelector("#settings-submit")

  /** @type {HTMLInputElement} */
  let api_field = form.querySelector("#settings-api")

  let settings = {
    api: null
  }

  while (true) {
    await waitForEvent(button, "click")

    settings.api = api_field.value
    
    if (!api) {
      alert("Введите API!")
      continue
    }

    break
  }

  form.remove()

  settings_opened = false
  return settings
}

async function get_settings() {
  let savedSettings = JSON.parse(localStorage.getItem('settings'))
  if (!savedSettings) {
    savedSettings = await ask_settings()
  }

  api.setApi(savedSettings.api)

  localStorage.setItem('settings', JSON.stringify(savedSettings))
}

/**
 * @param {HTMLDivElement} elem 
 * @param {number} current_vote 
 * @param {number} new_vote 
 */
function update_vote_block(elem, current_vote, new_vote, value) {
  let rating_elem = elem.querySelector(".vote-story-digs")
  let pluses_num_elem = elem.querySelector(".vote-btn-plus > .vote-story-num")
  let minuses_num_elem = elem.querySelector(".vote-btn-minus > .vote-story-num")

  rating_elem.textContent = Number(rating_elem.textContent) - (current_vote - new_vote)

  if (current_vote === 1 && value === -1) {
    pluses_num_elem.textContent = Number(pluses_num_elem.textContent) - 1
  } else if (current_vote === 0) {
    if (value === 1)
      pluses_num_elem.textContent = Number(pluses_num_elem.textContent) + 1
    else
    minuses_num_elem.textContent = Number(minuses_num_elem.textContent) + 1
  } else if (current_vote === -1 && value === 1) {
    minuses_num_elem.textContent = Number(minuses_num_elem.textContent) - 1
  }
}

let vote_process = false;
/**
 * @param {HTMLDivElement} elem 
 * @param {number} value 
 */
async function vote(elem, type, value) {
  if (vote_process || client.getId() == -1) return;

  let left_elem = elem.closest(".story-left-voting")  

  let item_id = Number(elem.parentElement.getAttribute("voting-item-id"))
  
  let current_vote = Number(elem.parentElement.getAttribute("current-vote"))
  let new_vote = current_vote + value

  if (current_vote == value) {
    vote_process = false
    return
  }

  // TODO check success

  update_vote_block(left_elem, current_vote, new_vote, value)

  elem.parentElement.setAttribute('current-vote', new_vote)

  let resp = await api.vote(item_id, type, new_vote)

  vote_process = false
}

let brovastik = document.getElementById("brovastik")
let brovastikHidden = true
let offsetY = 0
let lastScroll = 0
function onScroll(event) {
  offsetY += window.scrollY - lastScroll
  lastScroll = window.scrollY

  if (offsetY >= 300) {
    if (brovastikHidden)
      brovastik.classList.remove("brovastik-hidden")
    offsetY = 300
    brovastikHidden = false
  }
  else if (offsetY < 300 && !brovastikHidden) {
    brovastik.classList.add("brovastik-hidden")
    offsetY = -100
    brovastikHidden = true
  }
  else if (offsetY < -100) {
    offsetY = -100
  }
}


/**
 * @param {HTMLDivElement} elem 
 */
function toggleStory(elem) {
  const story = elem.closest(".story")
  const content = story.querySelector(".story-content")
  
  let closed = !JSON.parse(content.getAttribute("brief"))
  content.setAttribute("brief", closed)

  if (closed == true) {
    elem.textContent = "Раскрыть"

    if (story.getBoundingClientRect().bottom < 0) {
      story.scrollIntoView({behavior: "smooth"})
    }

  } else {
    elem.textContent = "Скрыть"
  }
}
window.toggleStory = toggleStory

/**
 * @param {HTMLDivElement} elem 
 */
function updateBrief(elem) {
  const content = elem.querySelector(".story-content")
  const rect = content.getBoundingClientRect()

  if (rect.height > 500) {
    content.setAttribute("brief", "true")
    elem.setAttribute("long", "true")
  }
}
window.updateBrief = updateBrief

window.init = init
window.vote = vote

window.client = client

addEventListener("scroll", onScroll)