import { htmlToElement } from "./utils.mjs"

function addElement(html) {
  const elem = htmlToElement(html)

  sidebar_elem.appendChild(elem)
}

/**
 * 
 * @param {HTMLFormElement} elem 
 */
async function sidebarLogin(elem) {
  let formData = new FormData(elem)
  let data = Object.fromEntries(formData)

  client.auth(data.login, data.password)
}

async function main() {
  let authorized = false

  addElement(templates.sidebar({
    authorized: client.getId() != -1,
    user: client
  }))

  if (!authorized) {
    let form = document.getElementById("auth-form")
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      sidebarLogin(e.target)
    })
  }
}

document.addEventListener('pukabu_inited', main)