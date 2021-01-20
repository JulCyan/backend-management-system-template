
import ElementUI from 'element-ui'
import { i18n } from '@/plugins'
export default {
  install(Vue: any) {
    Vue.use(ElementUI, {
      size: 'small',
      zIndex: 3000,
      i18n: (key: string, value: string) => i18n.t(key, value)
    })
  }
}
