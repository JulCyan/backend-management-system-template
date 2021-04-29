import { SuccessBusinessStatus, UnauthorizedBusinessStatus } from '@/configs/const/index'
import { AppModule, UserModule } from '@/plugins/store/modules'

import { AxiosRequestConfig } from 'axios'
import { Vue, Component } from 'vue-property-decorator'
import { msg } from '@/plugins/message'
import { HttpStatusServicesFactory } from '@/plugins/utils/strategy'
@Component
export default class ExportExcel extends Vue {
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
        return HttpStatusServicesFactory.getStatusService(response).handler(response)
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
