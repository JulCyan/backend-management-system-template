import { IRequestFunc } from '@/configs/interface'

export const getVerifyCode: IRequestFunc = () => ({
  method: 'get',
  responseType: 'arraybuffer',
  url: 'getVerifyCode'
})

export const login: IRequestFunc = (data) => ({
  method: 'post',
  url: 'login',
  data
})

export const logout: IRequestFunc = () => ({
  method: 'get',
  url: 'logout'
})

export const changePwd: IRequestFunc = (data) => ({
  method: 'post',
  url: 'account/changePwd',
  data
})

export const getCurrAccount: IRequestFunc = () => ({
  method: 'get',
  url: 'getCurrAccount'
})
