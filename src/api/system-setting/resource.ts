import { IRequestFunc } from '@/configs/interface'

const prefix = 'permission'
export const resourceListGetAllEnable: IRequestFunc = (params) => ({
  method: 'get',
  url: `${prefix}/getAllEnable`,
  params
})

export const resourceList: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/list`,
  data
})

export const resourceDetails: IRequestFunc = (id) => ({
  method: 'get',
  url: `${prefix}/details`,
  params: { id }
})

export const resourceAdd: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/add`,
  data
})

export const resourceEdit: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/edit`,
  data
})

export const resourceDel: IRequestFunc = (id) => ({
  method: 'get',
  url: `${prefix}/del`,
  params: { id }
})

export const verifyPerKey: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/del`,
  data
})
