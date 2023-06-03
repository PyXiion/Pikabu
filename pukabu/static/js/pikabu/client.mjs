import * as api from "./api.mjs";
import { PikabuFeed } from "./feed.mjs";

class PikabuClient {
  constructor() {
    this.avatar = ''
    this.user_id = -1
    this.name = 'guest'

    this.stories = {}

    const id = localStorage.getItem('user_id')
    if (id) {
      this.user_id = Number(id)
    }
  }

  async auth(login, password) {
    let data = await api.auth(login, password)
    
    this.avatar = data.avatar
    this.user_id = data.user_id
    this.name = data.user_name

    localStorage.setItem('user_id', this.user_id.toString())
  }

  getId() {
    return this.user_id
  }

  async getFeed(feedmode, page=1) {
    let feed = await PikabuFeed.fetch(feedmode, page)

    for (const story of feed.stories) {
      this.stories[story.id] = story
    }

    return feed
  }
}

export { PikabuClient };