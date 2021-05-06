import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { getLanguage } from '@/plugins/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import { RouteConfig } from 'vue-router'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage
    return cookieLanguage
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale
      return locale
    }
  }

  // Default language is Chinese
  return 'zh'
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages
})

export default i18n

export const getRouteTitle = (route) => {
  let result =
    i18n.t(`route.${route.meta.title}`) !== 'undefined'
      ? i18n.t(`route.${route.meta.title}`).toString()
      : undefined
  return result
}
