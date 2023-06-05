import * as api from './api.mjs'
import { PikabuComment } from './comment.mjs'

class PikabuStory {
  static async fetch(story_id, page=1) {
    const response = await api.getStory(story_id, page)

    return new PikabuStory(response.story, response.comments)
  }

  constructor(story_payload, comments_payload=null) {
    if (story_payload) {
      this.id = story_payload.story_id
      this.title = story_payload.story_title
      this.time = story_payload.story_time * 1000

      this.parent_id = story_payload.parent_story_id

      this.is_longpost = story_payload.is_longpost

      this.pluses = story_payload.story_pluses
      this.minuses = story_payload.story_minuses
      this.digs = story_payload.story_digs

      this.user_vote = story_payload.curr_user_vote

      this.comments_count = story_payload.comments_count

      this.tags = story_payload.tags

      this.parent_story_id = story_payload.parent_story_id

      this.content = story_payload.story_data

      this.author = {
        id: story_payload.user_id,
        name: story_payload.user_name,
        profile_url: story_payload.user_profile_url,
        avatar: story_payload.user_avatar_or_default
      }

      this.top_comment = null
      if (story_payload.top_comment) {
        this.top_comment = new PikabuComment(story_payload.top_comment, true)
      }
    }

    this.comments = null
    this.from_feed = false
    if (comments_payload)
      this.comments = comments_payload.map((c) => new PikabuComment(c))
    else
      this.from_feed = true
  }

  toHtml() {
    return templates.story(this)
  }
}

export { PikabuStory }