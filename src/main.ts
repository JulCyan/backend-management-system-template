import Vue from 'vue'

import 'normalize.css' // 初始化样式表
import '@/styles/element-variables.scss' // 自定义element变量样式表
import '@/styles/index.scss' // 全局样式表

import App from '@/App.vue'
import { router, store, axios, utils, notification, svg, element, i18n, errorLog } from '@/plugins'
import '@/plugins/router/interceptor' // vue router interceptor
import '@/plugins/registerServiceWorker' // pwa

Vue.use(axios) // ajax
Vue.use(utils) // 工具库
Vue.use(element) // element ui
Vue.use(notification) // 操作提示
Vue.use(svg) // svg
Vue.use(errorLog) // error-log

new Vue({
  router, // vue router
  store, // vue store
  i18n, // i18n lang
  render: (h) => h(App)
}).$mount('#app')
