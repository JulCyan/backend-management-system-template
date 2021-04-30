// import store from '@/plugins/store'
import { PermissionDirective } from '@/plugins/utils/directive'
import { UserType } from '@/configs/const'

export const getRolesSum = (): number => {
  // const { roleOverlay } = store.state.userInfo
  const roleOverlay = '0'
  return parseInt(roleOverlay, 10)
}

export const haveRolesPermission = (binding: any): boolean => {
  const pd = new PermissionDirective(binding)
  let showFlag = false
  // 获取用户权限合集
  const controlSum = getRolesSum()
  // 拆分用户权限
  const controlList = PermissionDirective.turnToBinaryPermissionSum(controlSum)
  // 特殊处理: 去除人员权限
  const empIndex = controlList.findIndex(item => item === UserType.emp)
  empIndex !== -1 && controlList.splice(empIndex, 1)
  // 找到拥有权限的一项
  controlList.find(item => (showFlag = pd.handler(item)))
  return showFlag
}

// directive functions
export default {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el: any, binding: any) {
    const showFlag = haveRolesPermission(binding)
    !showFlag && el.parentNode.removeChild(el)
  }
}
