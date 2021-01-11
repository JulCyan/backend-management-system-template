
import { IRequestFunc } from '@/configs/interface'
export const employeeGetListByName: IRequestFunc = (name) => ({
  method: 'get',
  url: 'employee/getListByName',
  params: { name }
})
