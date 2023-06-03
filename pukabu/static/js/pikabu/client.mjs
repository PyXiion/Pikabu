import * as api from "./api.mjs";
import { PikabuFeed } from "./feed.mjs";

class PikabuClient {
  constructor() {
    this.avatar = 'https://cs.pikabu.ru/images/def_avatar/def_avatar_72.png'
    this.user_id = -1
    this.name = 'guest'

    this.rating = 0
    this.subscribers = 0

    this.comment_image_ban = false

    this.stories = {}

    this.loadFromStorage()
  }

  loadFromStorage() {
    const id = JSON.parse(localStorage.getItem('user_id'))
    if (id == null || id == NaN || id == undefined || id == "-1") {
      return
    }
    console.log('load')
    let user_data = JSON.parse(localStorage.getItem('user_data'))

    this.user_id = Number(id)
    this.avatar = user_data.avatar || this.avatar
    this.name = user_data.name

    this.rating = user_data.rating
    this.subscribers = user_data.subscribers
    this.comment_image_ban = user_data.comment_image_ban
  }
  saveToStorage() {
    if (this.user_id == -1) {
      return
    }
    localStorage.setItem('user_id', JSON.stringify(this.user_id))
    localStorage.setItem('user_data', JSON.stringify({
      avatar: this.avatar,
      name: this.name,
      rating: this.rating,
      subscribers: this.subscribers,
      comment_image_ban: this.comment_image_ban
    }))
  }

  async auth(login, password) {
    let data = await api.auth(login, password)
    console.log(data)
    
    this.avatar = data.avatar
    this.user_id = data.user_id
    this.name = data.user_name

    this.rating = data.rating
    this.subscribers = data.subscribers_count
    this.comment_image_ban = data.is_add_comment_photo_ban

    this.saveToStorage()
    location.reload()
  }
  logout() {
    this.user_id = -1

    localStorage.removeItem('user_id')
    localStorage.removeItem('user_data')

    location.reload()
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