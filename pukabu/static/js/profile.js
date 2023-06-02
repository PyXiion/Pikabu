import { htmlToElement } from "./utils.mjs";
import { PikabuProfile } from "./pikabu/profile.mjs";

/** @type {PikabuProfile} */
let profile = null;

/** 
 * @param {any} pikabu element 
 */
function addElement(html) {
  const post = htmlToElement(html)

  main_elem.appendChild(post)
}

async function main() {
  await init()
  
  profile = await PikabuProfile.fetch(profile_user_name)
  addElement(profile.toHtml())

  let stories = await PikabuProfile.fetchStories(profile.name)
  stories.map((story) => addElement(story.toHtml()))
}

document.addEventListener("DOMContentLoaded", main);