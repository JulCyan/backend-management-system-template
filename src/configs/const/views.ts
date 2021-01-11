// Layout ---------------------------------------------------
export enum Layout {
  default = 'default',
  onlyShow = 'onlyShow',
  empty = 'empty'
}

export enum UserType {
  sys = 1, // systemAdmin
  ent = 2, // enterprise
  pro = 4, // project
  gro = 8, // group,
  emp = 16, // employees
  fin = 32, // finance
  yunwei = 0, // operation and maintenance
}

export enum _$PageType {
  edit = 'edit',
  add = 'add',
  detail = 'detail'
}

export enum ResourceStatus {
  enable = 0,
  disable = 1
}

export const resourceStatusList = [
  { label: '启用', value: ResourceStatus.enable },
  { label: '停用', value: ResourceStatus.disable }
]

export enum ResourceType {
  client = 0,
  dir = 1,
  menu = 2,
  button = 3
}

export const resourceTypeList = [
  { label: '客户端', value: ResourceType.client },
  { label: '目录', value: ResourceType.dir },
  { label: '菜单', value: ResourceType.menu },
  { label: '按钮', value: ResourceType.button }
]

export enum _$DictType {
  department = 'department',
  worktype = 'worktype',
  mushroomarea = 'mush_room_area',
  packroomnorthspec = 'pack_room_north_spec',
  packroomsouthspec = 'pack_room_south_spec',
  flowlinenum = 'flowline_num',
  packagingnum = 'packaging_num',
  settlingmicroberoom = 'settling_microbe_room'
}

export enum HouseType {
  dingzhi = 0,
  peiyang = 1
}

export const HouseTypeList = [
  {
    label: '定值房',
    value: HouseType.dingzhi
  },
  {
    label: '培养房',
    value: HouseType.peiyang
  }
]

export const MaxPageSize = 10000
