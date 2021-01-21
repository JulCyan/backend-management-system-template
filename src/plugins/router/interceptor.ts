import { router } from '..'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { UserModule } from '@/plugins/store/modules/user'
import { _isDev } from '@/configs/const'
import settings from '@/settings.json'

NProgress.configure({ showSpinner: false })

const getPageTitle = (metaTitle: string) => {
  if (metaTitle) {
    return `${metaTitle} - ${settings.title}`
  }
  return `${settings.title}`
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
  document.title = getPageTitle(to.meta.title)
})
