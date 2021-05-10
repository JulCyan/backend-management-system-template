import { RouteConfig } from 'vue-router/types'
import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index.vue'

Vue.use(Router)

/**
 * @name VueRouter
 * @description VueRouter 字段配置
 * @member { string, required, rule: aa-bb-cc } path VueRouter Path
 * @member { string, required, rule: aaBaCa } name VueRouter Name, 与组件 ClassName 保持一致(用于 TagsView 页面缓存)
 * @member { MetaConfig } meta VueRouter Meta
 */

/**
 * @name MetaConfig
 * @description VueRouter Meta 自定义字段
 * @member  { string, required } title 侧边栏文本, 也是面包屑的默认值
 * @member  { string } icon element字体图标类名
 * @member  { boolean, default: undefined } useBreadcrumb 为 false 时不展示面包屑
 * @member  { boolean, default: undefined } hidden 侧边栏是否隐藏
 * @member  { string } breadcrumb 面包屑的值, 默认不写时使用title的值
 * @member  { string } activeMenu 常用于 meta hidden 为 true 时, 侧边栏选中菜单
 */

export const WhiteRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { title: 'login', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    meta: { hidden: true },
    children: [
      {
        name: 'Index',
        path: '/',
        component: Index,
        meta: { title: 'index', hidden: true, affix: true }
      },
      {
        name: 'ChangePWD',
        path: 'change-pwd',
        component: () => import(/* webpackChunkName: "changePwd" */ '@/views/change-pwd/index.vue'),
        meta: { title: 'changePwd', hidden: true }
      }
    ]
  }
]

export const LocalRoutes: Array<RouteConfig> = [
  {
    name: 'SystemSetting',
    path: '/system-setting',
    component: () => import('@/layout/index.vue'),
    redirect: '/system-setting/account',
    meta: {
      title: 'systemSetting',
      icon: 'el-icon-setting'
    },
    children: [
      {
        name: 'Account',
        path: 'account',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/account/index.vue'),
        meta: {
          title: 'account'
        }
      },
      {
        name: 'Role',
        path: 'role',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/role/index.vue'),
        meta: {
          title: 'role'
        }
      },
      {
        name: 'Resource',
        path: 'resource',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/resource/index.vue'),
        meta: {
          title: 'resource'
        }
      },
      {
        name: 'Dict',
        path: 'dict',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/dict/index.vue'),
        meta: {
          title: 'dict'
        }
      },
      {
        name: 'DictData',
        path: 'dict/data',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/dict/data.vue'),
        meta: {
          title: 'dictData',
          hidden: true
        }
      }
    ]
  }
]

const router = new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    ...WhiteRoutes
  ]
})

// !解决(不建议) Uncaught (in promise) Error: Navigation cancelled from "/" to "/" with a new navigation.
// router.push = (location, resolve?, reject?) => {
//   if (resolve || reject) return Router.prototype.push.call(this, location, resolve, reject)
//   return Router.prototype.push.call(this, location).catch(err => {
//     console.log(err);
//   })
// }
// router.replace = (location, resolve?, reject?) => {
//   if (resolve || reject) return Router.prototype.push.call(this, location, resolve, reject)
//   return Router.prototype.push.call(this, location).catch(err => err)
// }

export default router

export const asyncAddRoutes = (routes: Array<RouteConfig>) => {
  router.addRoutes(routes)
}
