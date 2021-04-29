
import { ElNotificationOptions, Notification } from 'element-ui'

export function message(args: ElNotificationOptions) {
  Notification.closeAll()
  Notification({
    title: '提示',
    duration: 2000,
    ...args
  })
}

export const msg = message

export default {
  install(Vue: any) {
    Vue.prototype.$msg = message
  }
}
