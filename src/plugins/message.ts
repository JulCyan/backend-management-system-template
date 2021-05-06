
import { Message } from 'element-ui'
import { ElMessageOptions } from 'element-ui/types/message'

export function message(args: ElMessageOptions) {
  Message.closeAll()
  Message({
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
