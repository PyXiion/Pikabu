var templates = {};

async function fetch_template(filename) {
  const filepath = '/static/templates/' + filename
  let response = await fetch(filepath)
  return ejs.compile((await response.text()).toString())
}

async function load_templates() {
  templates.settings = await fetch_template('settings.ejs')

  templates.story = await fetch_template('story.ejs')
  templates.comment = await fetch_template('comment.ejs')
  templates.profile = await fetch_template('profile.ejs')

  templates.sidebar_profile = await fetch_template('sidebar_profile.ejs')
}

var words = {
  ru: {
    pluses: ['плюсик', 'плюсика', 'плюсиков'],
    minuses: ['минусик', 'минусика', 'минусиков'],
    stories: ['пост', 'поста', 'постов'],
    comments: ['комментарий', 'комментария', 'комментариев'],
    subscribers: ['подписчик', 'подписчика', 'подписчиков'],
  }
}
words = words.ru

function inflect(num, words) {
  if (num%10 === 1 && num%100 !== 11) {
    return words[0]
  } else if (num%10 >= 2 && num%10 <= 4 && !(num%100 >= 12 && num%100 <= 14)) {
    return words[1]
  } else {
    return words[2]
  }
}
function getInflected(num, words) {
  return num + ' ' + inflect(num, words)
}

/**
 * 
 * @param {Date} date 
 * @param {string} locale 
 * @returns {string}
 */
function formatDate(date, locale = 'ru') {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }

  const diff = Date.now() - date.getTime()
  const words = {
    en: [
      ['year', 'years'],
      ['month', 'months'],
      ['week', 'weeks'],
      ['day', 'days'],
      ['hour', 'hours'],
      ['minute', 'minutes'],
      ['second', 'seconds']
    ],
    ru: [
      ['год', 'года', 'лет'],
      ['месяц', 'месяца', 'месяцев'],
      ['неделю', 'недели', 'недель'],
      ['день', 'дня', 'дней'],
      ['час', 'часа', 'часов'],
      ['минуту', 'минуты', 'минут'],
      ['секунду', 'секунды', 'секунд']
    ]
  }
  const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']

  if (diff < 1000) {
    return 'только что'
  } else if (diff < 0) {
    return 'в будущем'
  } else {
    const seconds = Math.floor(diff / 1000)
    let value, word
    for (let i = 0; i < units.length; i++) {
      value = Math.floor(seconds / timeValues[units[i]])
      if (value >= 1) {
        word = inflect(value, words[locale][i])
        return `${value} ${word} назад`
      }
    }
    return 'только что'
  }
}

const timeValues = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
}