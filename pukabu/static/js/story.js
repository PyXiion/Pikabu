import * as api from "./pikabu/api.mjs";
import { htmlToElement } from "./utils.mjs";
import { PikabuStory } from './pikabu/story.mjs'
import { PikabuCommentTree } from "./pikabu/comment_tree.js";


/** @type {HTMLElement} */
let main_elem

/** @type {PikabuStory} */
let story = null;

async function init() {
  if (!api.checkApiKey())
    await api.fetchApiKey()
  
  await load_templates()

  main_elem = document.getElementById("main")
}

/** 
 * @param {any} pikabu element 
 */
function addElement(html) {
  const post = htmlToElement(html)

  main_elem.appendChild(post)
}

async function main() {
  await init()
  
  story = await PikabuStory.fetch(story_id)
  addElement(story.toHtml())

  addElement(story.commentsBlock())

  console.log()
}

/**
 * @param {HTMLElement} commentTree 
 */
function openChildren(commentTree) {
  /** @type {HTMLElement} */
  let commentElem = commentTree.parentNode;
  
  let isChildrenClosed = commentElem.hasAttribute('children-closed')
  let text = commentTree.firstElementChild

  if (isChildrenClosed) {
    text.textContent = "Закрыть ветку"
    commentElem.removeAttribute('children-closed')
  } else {
    text.textContent = "Открыть ветку"
    commentElem.setAttribute('children-closed', '')
  }
}
window.openChildren = openChildren

document.addEventListener("DOMContentLoaded", main);