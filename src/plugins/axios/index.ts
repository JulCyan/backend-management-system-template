import { _isDev } from '@/configs/const/env'
import { UserModule } from '@/plugins/store/modules/user'
import { SuccessStatus, ServerErrorStatus, UnauthorizedStatus } from '@/configs/const'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { notification as Notification } from '../notification'
const baseURL = process.env.VUE_APP_API_URL + process.env.VUE_APP_PREFIX

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
  // http status 为 2xx
  if (SuccessStatus.includes(response && response.status)) {
    if (['arraybuffer'].includes(response.request.responseType)) {
      return response
    }
    businessCodeHandler(response)
  }
}, (responseError) => {
  let { response } = responseError
  if (ServerErrorStatus.includes(response && response.status)) {
    response.data = {}
    return response
  } else if (UnauthorizedStatus.includes(response && response.status)) {
    UserModule.ResetToken()
    location.reload()
    response.data = {}
    return response
  }
})

export const businessCodeHandler = (response) => {
  let { code, state, message } = response.data
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
}

export default {
  install(Vue: any) {
    Vue.prototype.$axios = instance
  }
}
