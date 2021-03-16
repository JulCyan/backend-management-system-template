import { SuccessStatus, UnauthorizedStatus } from '@/configs/const/index'
import { AppModule, UserModule } from '@/plugins/store/modules'

import { AxiosRequestConfig } from 'axios'
import { Vue, Component } from 'vue-property-decorator'
import { notification as Notification } from '@/plugins/notification'
@Component
export default class ExportFile extends Vue {
  public _$exportExcel(requestConfig: AxiosRequestConfig) {
    requestConfig.method && requestConfig.method.toLowerCase() === 'get' ? this.exportByGet(requestConfig) : this.exportByPost(requestConfig)
  }

  protected exportByPost(requestConfig: AxiosRequestConfig) {
    this.$axios({
      method: 'post',
      responseType: 'arraybuffer',
      ...requestConfig
    }).then(response => {
      if (response.headers['content-type'].includes('application/json')) {
        response.data = JSON.parse(this.$utils.arrayBufferToJSON(response.data))
        const { code, state, message } = response.data
        // 业务状态码 为 2xx
        if (SuccessStatus.includes(code)) {
          !state && Notification({
            type: 'success',
            message
          })
          return response.data
          // 业务状态码 为 401 or 403
        } else if (UnauthorizedStatus.includes(code)) {
          UserModule.ResetToken()
          location.reload()
          // 无访问权限
        } else if (code === 4003) {
          !state && Notification({
            type: 'error',
            message,
            onClose: () => {
              location.href = '/'
            }
          })
          // others
        } else {
          !state && Notification({
            type: 'error',
            message
          })
          response.data = {}
          return response.data
        }
      } else {
        this.$utils.exportExcel(response)
      }
    })
  }

  protected exportByGet(requestConfig: AxiosRequestConfig) {
    const { params, url } = requestConfig
    const query = this.$utils.turnToUrlQuery({ ...params, token: UserModule.token })
    window.open(`${AppModule.baseURL}${url}?${query}`)
  }
}
