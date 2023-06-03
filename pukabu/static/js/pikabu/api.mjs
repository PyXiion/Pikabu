import { MD5 } from "../utils.mjs"

const apiEndPoint = 'http://localhost:45450/'
let apiKey = null

let headers = {
  "deviceid": "0",
  "user-agent": "ru.pikabu.android/1.21.15 (SM-N975F Android 7.1.2)",
  "accept-encoding": "gzip"
}

export const FeedMode = {
  Best: 'nbest_alltime',
  Best24: 'nbest_24',
  Best7: 'nbest_week',
  Best30: 'nbest_month',
  Hot: 'hot_act',
  New: 'upcoming',
  // Subs: 'subs'
}

/**
 * 
 * @param {Object.<string, Object>} params 
 * @param {string} controller 
 * @param {number} currentMsecs 
 * @returns 
 */
function createHash(params, controller, currentMsecs) {
  let join = Object.values(params).sort().join(',')
  let to_hash = [apiKey, controller, currentMsecs, join].join(',')
  let to_encrypt = MD5(to_hash)
  return btoa(to_encrypt)
}

/**
 * 
 * @param {string} controller 
 * @param {Object.<string, Object>} params 
 * @returns 
 */
function createRequestData(controller, params) {
  let request = {
    new_sort: 1,
    ...params
  }
  let msecs = Date.now()
  return {
    ...request,
    id: "iws",
    hash: createHash(request, controller, msecs),
    token: msecs
  }
}

/**
 * 
 * @param {string} controller 
 * @param {Object.<string, Object>} params 
 * @returns 
 */
async function makeRequest(controller, params) {
  if (client.getId() != -1) {
    params["user_id"] = client.getId()
  }

  const requestData = createRequestData(controller, params)
  const response = await fetch(apiEndPoint + controller, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: headers,
    credentials: 'include'
  })
  
  let data = await response.json()
  
  if (!"response" in data)
    throw Error("Failed to make request.")

  return data.response
}

export async function vote(item_id, type, value) {
  if (client.getId() == -1) return; // TODO throw error
  return await makeRequest('vote.new', {type, vote: value, item_id})
}

/**
 * Auth
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
export async function auth(username, password) {
  return await makeRequest('user.auth', {user_name: username, password}, true)
}

/**
 * Get user's stories
 * @param {string} username 
 * @param {number} page 
 * @returns 
 */
export async function getUserStories(username, page=1) {
  return await makeRequest('story.profile.get', {user_name: username, page})
}

/**
 * Get Pikabu profile
 * @param {string} username 
 * @returns 
 */
export async function getProfile(username) {
  return await makeRequest('user.profile.get', {user_name: username})
}

/**
 * Get Pikabu feed
 * @param {string} feedmode 
 * @param {int} page 
 * @returns 
 */
export async function getFeed(feedmode, page=1) {
  return await makeRequest('feed', {cmd: feedmode, page})
}

/**
 * Get Pikabu story
 * @param {number} story_id
 * @param {number} page ???
 * @returns 
 */
export async function getStory(story_id, page=1) {
  return await makeRequest('story.get', {story_id, page})
}

/**
 * Check Pikabu API key
 * @returns true if api key is okay
 */
export function checkApiKey() {
  if (apiKey === null)
    return false

  // TODO

  return true
}

/**
 * Get API key from server
 */
export async function fetchApiKey() {
  const response = await fetch('/api/key')
  apiKey = await response.text()
}