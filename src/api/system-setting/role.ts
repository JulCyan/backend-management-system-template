import { IRequestFunc } from '@/api'

const prefix = 'role'
export const roleGetAll: IRequestFunc = () => ({
  method: 'get',
  url: `${prefix}/getAll`
})

export const roleList: IRequestFunc = (data: { roleName: string }) => ({
  method: 'post',
  url: `${prefix}/list`,
  data
})

export const roleAdd: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/add`,
  data
})

export const roleDetails: IRequestFunc = (id: string) => ({
  method: 'get',
  url: `${prefix}/details`,
  params: {
    id
  }
})

export const roleEdit: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/edit`,
  data
})

export const roleDel: IRequestFunc = (id: string) => ({
  method: 'get',
  url: `${prefix}/del`,
  params: {
    id
  }
})
