class PikabuComment {
  constructor(payload, from_feed=false) {
    this.id = payload.comment_id
    this.parent_id = payload.parent_id
    
    this.time = payload.comment_time * 1000
    
    this.content = payload.comment_desc
    this.from_feed = from_feed

    this.rating = payload.comment_rating
    this.pluses = payload.comment_pluses
    this.minuses = payload.comment_minuses

    this.story_id = payload.story_id

    this.can_replay = payload.can_replay
    this.current_user_vote = payload.curr_user_vote

    this.author = {
      id: payload.user_id,
      name: payload.user_name,
      
      avatar: payload.user_avatar_url || 'https://cs.pikabu.ru/images/def_avatar/def_avatar_72.png',
      profile_url: payload.user_profile_url,
      
      is_moderator: payload.is_moderator_username,
      is_deleted: payload.is_deleted
    }
  }

  toHtml() {
    return templates.comment(this)
  }
}

export { PikabuComment }