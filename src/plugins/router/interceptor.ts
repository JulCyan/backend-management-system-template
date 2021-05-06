import { router, i18n } from '..'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { SettingsModule, UserModule } from '@/plugins/store/modules'
import { _isDev } from '@/configs/const'
import settings from '@/settings.json'

import { getRouteTitle } from '../lang'

NProgress.configure({ showSpinner: false })

const getPageTitle = (metaTitle: string) => {
  const settingsTitle = SettingsModule.$settings.title
  if (metaTitle) {
    return `${metaTitle} - ${settingsTitle}`
  }
  return `${settingsTitle}`
}

const whiteList = ['/login']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  NProgress.start()
  if (settings.enableRouterInterceptor) {
    if (UserModule.token) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        next()
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    next()
  }
})

router.afterEach((to: Route) => {
  NProgress.done()
  document.title = getPageTitle(getRouteTitle(to))
})
