
import { typeofReturns } from '@/configs/const'
import { ElMessageOptions, Message } from 'element-ui'

export const MessageList: Map<string, any> = new Map()

export function message(args: ElMessageOptions) {
  MessageService.getInstance().put(args.message as string, args)
}

export class MessageService {
  private static instance = new MessageService()
  static list: Map<string, any> = new Map()

  static getInstance(): MessageService {
    return this.instance
  }

  put(key: string, args: ElMessageOptions) {
    if (MessageService.list.has(key)) {
      return
    }
    MessageService.list.set(key, args)
    this.handler(args)
  }

  remove(key: string) {
    MessageService.list.delete(key)
  }

  protected handler(args: ElMessageOptions) {
    if (args.closeAll !== false) {
      Message.closeAll()
    }
    Message({
      duration: 2 * 1000,
      ...args,
      onClose: () => {
        args.onClose && args.onClose.call(this)
        MessageService.getInstance().remove(args.message as string)
      }
    })
  }
}

export const msg = message

export default {
  install(Vue: any) {
    Vue.prototype.$msg = message
  }
}
