import { Utils } from '@/plugins/utils'
import { AxiosRequestConfig } from 'axios'
import { IExtensionAxiosResponsePromise  } from '@/type'
import { ElNotificationComponent } from 'element-ui/types/notification'
declare module 'vue/types/vue' {
  interface Vue {
    $utils: Utils
    $axios: (config: AxiosRequestConfig) => IExtensionAxiosResponsePromise 
    $notification: (args: any) => ElNotificationComponent
  }
}
