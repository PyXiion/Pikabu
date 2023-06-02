import { getProfile, getUserStories } from "./api.mjs"
import { PikabuStory } from "./story.mjs"

class PikabuAward {
  constructor(payload) {
    this.id = payload.id
    this.award_id = payload.award_id
    this.user_id = payload.user_id

    this.title = payload.award_title
    this.image = payload.award_image

    this.story_id = payload.story_id
    this.story_title = payload.story_title

    this.comment_id = payload.comment_id
    this.special_url = payload.special_url
    this.link = payload.link

    this.date = new Date(payload.date)
    this.is_hidden = new Boolean(payload.is_hidden)
  }
}

class PikabuProfile {
  /**
   * @param {string} username 
   * @returns {PikabuProfile}
   */
  static async fetch(username) {
    return new PikabuProfile(await getProfile(username))
  }

  /**
   * 
   * @param {string} username 
   * @param {number} page 
   * @returns {Array<PikabuStory>}
   */
  static async fetchStories(username, page=1) {
    return (await getUserStories(username, page)).data.map(
      (story) => new PikabuStory(story)
    )
  }

  constructor(payload) {
    payload = payload.user
    this.id = payload.user_id
    this.name = payload.user_name
    this.about = payload.about
    this.registration_duration = payload.registration_duration
    this.signup_date = new Date(this.signup_date * 1000)
    
    this.rating = payload.rating
    this.subscribers = payload.subscribers_count
    
    this.comments_count = payload.comments_count
    this.stories_count = payload.stories_count
    this.pluses_count = payload.pluses_count
    this.minuses_count = payload.minuses_count
    
    this.is_rating_ban = payload.is_rating_ban
    this.is_banned = payload.is_user_banned
    this.is_banned_pernament = payload.is_user_fully_banned
    this.is_slow_moded = payload.is_slow_mode_enabled
    this.is_extended = payload.is_show_extended_profile
    this.is_advert_blogs = payload.is_advert_blogs_user
    this.slow_mode_text = payload.slow_mode_text // ???

    this.ban_history = [] // TODO later

    this.avatar = payload.avatar  || 'https://cs.pikabu.ru/images/def_avatar/def_avatar_72.png'
    this.background = payload.header_bg_url

    this.awards = payload.awards.map((award) => new PikabuAward(award))

    this.approved = payload.approved

    this.communities = [] // TODO later
  }

  toHtml() {
    return templates.profile(this)
  }
}

export { PikabuProfile, PikabuAward }