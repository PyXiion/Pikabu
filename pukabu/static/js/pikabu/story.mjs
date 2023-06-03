import * as api from './api.mjs'
import { PikabuComment } from './comment.mjs'
import { PikabuCommentTree } from './comment_tree.js'

class PikabuStory {
  static async fetch(story_id) {
    const response = await api.getStory(story_id)

    return new PikabuStory(response.story, response.comments)
  }

  constructor(payload, comments_payload=null) {
    this.id = payload.story_id
    this.title = payload.story_title
    this.time = payload.story_time * 1000

    this.pluses = payload.story_pluses
    this.minuses = payload.story_minuses
    this.digs = payload.story_digs

    this.user_vote = payload.curr_user_vote

    this.comments_count = payload.comments_count

    this.tags = payload.tags

    this.parent_story_id = payload.parent_story_id

    this.content = payload.story_data

    this.author = {
      id: payload.user_id,
      name: payload.user_name,
      profile_url: payload.user_profile_url,
      avatar: payload.user_avatar_or_default
    }

    this.top_comment = null
    if (payload.top_comment) {
      this.top_comment = new PikabuComment(payload.top_comment, true)
    }

    this.comments = []
    this.from_feed = false
    if (comments_payload)
      this.comments = new PikabuCommentTree(comments_payload.map((c) => new PikabuComment(c)))
    else
      this.from_feed = true
  }

  toHtml() {
    return templates.story(this)
  }

  commentsBlock() {
    return templates.story_comments(this)
  }
}

export { PikabuStory }