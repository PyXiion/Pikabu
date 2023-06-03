import * as api from "./pikabu/api.mjs";
import { htmlToElement } from "./utils.mjs";
import { PikabuStory } from './pikabu/story.mjs'
import { PikabuFeed } from "./pikabu/feed.mjs";

/** @type {Array<HTMLElement>} */
let stories = []

/** @type {HTMLElement} */
let current_story = null

/** 
 * @param {PikabuStory} story 
 */
function addStory(story) {
  const post = htmlToElement(story.toHtml())

  main_elem.appendChild(post)
  stories.push(post)
}

async function loadPage(page=1) {
  let feed = await client.getFeed(api.FeedMode[feedmode], page)

  for (const story of feed.stories) {
    addStory(story)
  }
}

async function main() {
  await init()
  
  await loadPage()
}

function handleScroll() {
  const scrollTop = document.documentElement.scrollTop
  const height = window.innerHeight

  for (let story of stories) {
    const rect = story.getBoundingClientRect()

    if (rect.top >= 0 && rect.top <= height || 
      rect.bottom >= 0 && rect.bottom <= height ||
      rect.top < 0 && rect.bottom > height) {
      current_story = story
      story.setAttribute('current-story', true)
    } else {
      story.removeAttribute('current-story')
    }
  }
}

document.addEventListener("DOMContentLoaded", main);
document.addEventListener("scroll", handleScroll)