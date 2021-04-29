

declare module 'element-ui' {
    export class Scrollbar { }
    import { MessageType } from 'element-ui/types/message'
    import { VNode } from 'vue'
    export * from 'element-ui/types/element-ui'
    import * as ElementUI from 'element-ui/types/element-ui'
    export default ElementUI

    // 扩展 Notification 
    import { ElNotification as ELN, NotificationPosition } from 'element-ui/types/notification'
    export interface ElNotification extends ELN {
        closeAll(): void
    }

    // 重写 ElNotificationOptions
    interface ELNOpt {
        /** Description text */
        message: string | VNode

        /** Notification type */
        type?: MessageType

        /** Custom icon's class. It will be overridden by type */
        iconClass?: string

        /** Custom class name for Notification */
        customClass?: string

        /** Duration before close. It will not automatically close if set 0 */
        duration?: number

        /** Whether to show a close button */
        showClose?: boolean

        /** Whether message is treated as HTML string */
        dangerouslyUseHTMLString?: boolean

        /** Callback function when closed */
        onClose?: () => void

        /** Callback function when notification clicked */
        onClick?: () => void

        /** Offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset */
        offset?: number

        /** custom position */
        position?: NotificationPosition
    }
    export interface ElNotificationOptions extends ELNOpt {
        /** Title */
        title?: string
    }

    export const Notification: ElNotification

}
