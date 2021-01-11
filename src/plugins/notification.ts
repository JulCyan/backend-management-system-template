
import { Notification } from 'element-ui'

export function notification(args: any) {
  // @ts-ignore
  Notification.closeAll()
  Notification({
    title: '提示',
    duration: 2000,
    ...args
  })
}
export default {
  install(Vue: any) {
    Vue.prototype.$notification = notification
  }
}
