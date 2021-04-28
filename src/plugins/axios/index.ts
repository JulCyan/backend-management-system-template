import { AppModule, UserModule } from '@/plugins/store/modules'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import settings from '@/settings.json'
import { HttpStatusServicesFactory } from '@/plugins/utils/strategy'
const baseURL = settings.enableProxy ? process.env.VUE_APP_PREFIX : AppModule.baseURL

export const instance = axios.create({
  baseURL,
  timeout: 30 * 1000,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
  // post json 转 表单
  // transformRequest: [function (data) {
  //   let ret = ''
  //   for (let it in data) {
  //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  //   }
  //   return ret
  // }],
})

instance.interceptors.request.use((request: AxiosRequestConfig): any => {
  request.headers.common.token = UserModule.token || null
  return request
}, (requestError) => { })

instance.interceptors.response.use((response: AxiosResponse): any => {
  return HttpStatusServicesFactory.getStatusService(response).handler(response)
}, (responseError) => {
  const response: AxiosResponse = responseError?.response
  return HttpStatusServicesFactory.getStatusService(response).handler(response)
})

export default {
  install(Vue: any) {
    Vue.prototype.$axios = instance
  }
}
