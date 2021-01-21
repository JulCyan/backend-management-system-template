import { IRequestFunc } from '@/api'

export const employeeGetListByName: IRequestFunc = (name) => ({
  method: 'get',
  url: 'employee/getListByName',
  params: { name }
})
