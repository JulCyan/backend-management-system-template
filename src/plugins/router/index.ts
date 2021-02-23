import { RouteConfig } from 'vue-router/types'
import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index.vue'

Vue.use(Router)

/**
 * @name VueRouter
 * @description VueRouter 字段配置
 * @param { string, required, rule: aa-bb-cc } path VueRouter Path
 * @param { string, required, rule: aaBaCa } name VueRouter Name
 * @param { MetaConfig } meta VueRouter Meta
 */

/**
 * @name Meta
 * @description VueRouter Meta 自定义字段
 * @param  { string, required } title 侧边栏文本, 也是面包屑的默认值
 * @param  { string } icon element字体图标类名
 * @param  { boolean, default: undefined } useBreadcrumb 为 false 时不展示面包屑
 * @param  { boolean, default: undefined } hidden 侧边栏是否隐藏
 * @param  { string } breadcrumb 面包屑的值, 默认不写时使用title的值
 * @param  { string } activeMenu 常用于 meta hidden 为 true 时, 侧边栏选中菜单
 */

export const WhiteRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { title: 'login', hidden: true }
  },
  {
    path: '/404',
    name: '404',
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
        name: 'index',
        path: '/',
        component: Index,
        meta: { title: 'index', hidden: true, affix: true }
      },
      {
        name: 'change-pwd',
        path: 'change-pwd',
        component: () => import(/* webpackChunkName: "changePwd" */ '@/views/change-pwd/index.vue'),
        meta: { title: 'changePwd', hidden: true }
      }
    ]
  }
]

export const LocalRoutes: Array<RouteConfig> = [
  {
    name: 'system-setting',
    path: '/system-setting',
    component: () => import('@/layout/index.vue'),
    redirect: '/system-setting/account',
    meta: {
      title: 'systemSetting',
      icon: 'el-icon-setting'
    },
    children: [
      {
        name: 'account',
        path: 'account',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/account/index.vue'),
        meta: {
          title: 'account'
        }
      },
      {
        name: 'role',
        path: 'role',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/role/index.vue'),
        meta: {
          title: 'role'
        }
      },
      {
        name: 'resource',
        path: 'resource',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/resource/index.vue'),
        meta: {
          title: 'resource'
        }
      },
      {
        name: 'dict',
        path: 'dict',
        component: () => import(/* webpackChunkName: "[request]" */ '@/views/system-setting/dict/index.vue'),
        meta: {
          title: 'dict'
        }
      },
      {
        name: 'dict/data',
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
export default router

export const asyncAddRoutes = (routes: Array<RouteConfig>) => {
  router.addRoutes(routes)
}
