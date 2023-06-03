import * as api from './api.mjs'
import { PikabuStory } from './story.mjs'

class PikabuFeed {
  static async fetch(feedmode, page=1) {
    return new PikabuFeed(await api.getFeed(feedmode, page))
  }

  constructor(payload) {
    /** @type {Array<PikabuStory>} */
    this.stories = payload.data.map(story_payload => new PikabuStory(story_payload));
    this.total = payload.total_stories
    this.page = payload.page
    this.hide_visited_stories = payload.hide_visited_stories
    this.hidden_stories_count = payload.hidden_stories_count
    this.hidded_by_rating = payload.hidded_by_rating
  }
}

export { PikabuFeed }