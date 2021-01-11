import Vue from 'vue'

import 'normalize.css'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import { router, store, axios, utils, notification, svg, element } from '@/plugins'
// import '@/plugins/router/interceptor'
import '@/plugins/registerServiceWorker'

Vue.use(axios)
Vue.use(utils)
Vue.use(element)
Vue.use(notification)
Vue.use(svg)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
