import { MaxPageSize } from '@/configs/const/views'
import { IRequestFunc } from '@/configs/interface'

const prefix = 'sys'
export const dictList: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/dictTypeList`,
  data
})

export const dictDetails: IRequestFunc = (id) => ({
  method: 'post',
  url: `${prefix}/dictTypeDetail`,
  data: { id }
})

export const dictAdd: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/addDictType`,
  data
})

export const dictEdit: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/uptDictType`,
  data
})

export const dictDel: IRequestFunc = (id) => ({
  method: 'post',
  url: `${prefix}/delDictType`,
  data: { id }
})

export const dictItemList: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/dictItemList`,
  data
})

export const dictItemListByDictType: IRequestFunc = (diType) => dictItemList({ diType, pageSize: MaxPageSize })

export const dictItemDetails: IRequestFunc = (id) => ({
  method: 'post',
  url: `${prefix}/dictItemDetail`,
  data: { id }
})

export const dictItemAdd: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/addDictItem`,
  data
})

export const dictItemEdit: IRequestFunc = (data) => ({
  method: 'post',
  url: `${prefix}/uptDictItem`,
  data
})

export const dictItemDel: IRequestFunc = (id) => ({
  method: 'post',
  url: `${prefix}/delDictItem`,
  data: { id }
})
