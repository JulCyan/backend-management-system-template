import Vue from 'vue'

import 'normalize.css' // 初始化样式表
import '@/styles/index.scss' // 全局样式表

import App from '@/App.vue'
import { router, store, axios, utils, message, svg, element, i18n, errorLog } from '@/plugins'
import '@/plugins/router/interceptor'
import '@/plugins/pwa'

Vue.use(axios) // ajax
Vue.use(utils) // 工具库
Vue.use(element)
Vue.use(message) // 操作提示
Vue.use(svg) // svg组件
Vue.use(errorLog) // 错误日志

new Vue({
  router,
  store,
  i18n, // 多语言
  render: (h) => h(App)
}).$mount('#app')
