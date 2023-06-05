import * as api from "./pikabu/api.mjs";
import { htmlToElement, htmlToElements } from "./utils.mjs";
import { PikabuStory } from './pikabu/story.mjs'

/** @type {PikabuStory} */
let story = null;

/** @type {HTMLDivElement} */
let comments_elem = null

/** 
 * @param {any} pikabu element 
 */
function addElement(html) {
  const post = htmlToElement(html)

  main_elem.appendChild(post)
}
/** 
 * @param {any} pikabu element 
 */
function addElements(html) {
  const post = htmlToElements(html)

  post.forEach((e) => main_elem.appendChild(e))
}

function addComment(comment) {
  let parent_elem = comments_elem

  if (comment.parent_id != 0)
    parent_elem = document.querySelector(`.comment[comment-id="${comment.parent_id}"] > .comment-children > .comment-children-content`)

  if (!parent_elem) {
    return
  }

  const comment_elem = htmlToElement(comment.toHtml())
  parent_elem.parentElement.setAttribute("has-children", "")
  parent_elem.appendChild(comment_elem)
}

let page = 1

let loading = false;
let no_more_comments = false;

async function loadCommentPage(page=1, story = null) {
  if (loading || no_more_comments) return;
  loading = true

  if (!story)
    story = await PikabuStory.fetch(story_id, page)
  
  if (!story.comments.length)
    no_more_comments = true

  for (const comment of story.comments)
    addComment(comment)
  loading = false
}

async function main() {
  await init()

  story = await PikabuStory.fetch(story_id)
  addElements(story.toHtml())

  comments_elem = document.getElementById("comments")

  await loadCommentPage(1, story)
  
  onScroll()

  if (window.location.hash === "#comments") {
    comments_elem.scrollIntoView({ behavior: "smooth" })
  }
}

async function onScroll() {
  if ((window.innerHeight + window.scrollY) + 1 >= document.body.offsetHeight && !loading) {
    page += 1
    
    await loadCommentPage(page)

    onScroll()
  }
};

/**
 * @param {HTMLElement} commentTree 
 */
function openChildren(commentTree) {
  /** @type {HTMLElement} */
  let commentElem = commentTree.parentElement;
  
  let isChildrenClosed = commentElem.hasAttribute('children-closed')
  let text = commentElem.querySelector(":scope > .comment-toggle-children > .comment-toggle-children-button")

  if (isChildrenClosed) {
    text.textContent = "Закрыть ветку"
    commentElem.removeAttribute('children-closed')
  } else {
    text.textContent = "Открыть ветку"
    commentElem.setAttribute('children-closed', '')

    if (commentElem.getBoundingClientRect().bottom < 0)
      commentElem.scrollIntoView({
        behavior: "smooth"
      })
  }
}
window.openChildren = openChildren

document.addEventListener("DOMContentLoaded", main);
document.addEventListener("scroll", onScroll)