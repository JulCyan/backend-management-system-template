import permission from './permission'
import clipboard from './clipboard'
import focus from './focus'
import { ClipboardDirective, PermissionDirective } from '@/plugins/utils/directive'
export default {
  install(Vue: any) {
    /**
      * @directive permission
      * @param { string arg }
      * @modifiers
      * @description 参数设置: exact 精准匹配 inverse 取反 includes 包含 excludes 不包含
      *   使用前两种指令参数时, 值为 number, 后两种为 Array<number> 默认参数为 exact
    */
    Vue.directive(PermissionDirective._name, permission)
    Vue.directive(ClipboardDirective._name, clipboard)
    Vue.directive('focus', focus)
  }
}
