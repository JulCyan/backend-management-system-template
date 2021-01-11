import { IRequestFunc } from '@/configs/interface'

const prefix = 'account'
export const accountGetBindAccountRoles: IRequestFunc = () => ({
  method: 'get',
  url: `${prefix}/getBindAccountRoles`
})

export const accountList: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/list`,
  data
})

export const accountAdd: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/add`,
  data
})

export const accountResetPwd: IRequestFunc = (id) => ({
  method: 'get',
  url: `${prefix}/resetPwd`,
  params: { id }
})

export const accountDel: IRequestFunc = (id) => ({
  method: 'get',
  url: `${prefix}/del`,
  params: { id }
})

export const accountDetails: IRequestFunc = (id) => ({
  method: 'get',
  url: `${prefix}/details`,
  params: { id }
})

export const accountEdit: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/edit`,
  data
})
