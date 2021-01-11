import { ResourceType, BrowserType, ImplicitParseFalseExcludes, WeChatJsApiList as jsApiList, RegWeChat, PermissionArgs, DataType } from '@/configs/const'
import Layout from '@/layout/index.vue'
import { BaseNS } from '@/configs/type'
import { IDirectiveBinding } from '@/configs/interface'
import VueRouter, { RawLocation, RouteConfig } from 'vue-router/types'
import { VueConstructor } from 'vue'
import moment from 'moment'
// 此处继承没有必要联系, 只是为了区分职责, ts 只能单类继承
export class StorageOperation {
  private readonly cookies: any
  constructor(configs?: utilsConfigs) {
    this.cookies = configs && configs.cookies
  }
  /**
   * 设置本地缓存
   * @param { key: str , val: any }
   * @retunrs true: bool
   */
  public setS<T>({ key, val }: { key: string, val: T }): string {
    let result: string = JSON.stringify(val)
    sessionStorage.setItem(key, result)
    return result
  }

  /**
   * 读取本地缓存
   * @param key
   * @retunrs *: any
   */
  public getS(key: string = ''): string | object {
    let result = sessionStorage.getItem(key) || ''
    try {
      result = JSON.parse(result)
    } catch (error) {
      console.log(error)
    }
    return result
  }

  /**
   * 删除本地缓存
   * @param key
   * @returns {}
   */
  public removeS(key: string = '') {
    sessionStorage.removeItem(key)
    return this
  }

  public isExistCookies(): boolean {
    return Boolean(this.cookies)
  }

  public setCookie(key: string, val: any, configs?: any): any {
    if (!this.isExistCookies()) return
    return this.cookies.set(key, val, configs)
  }

  public getCookie(key?: string, configs?: any): any {
    if (!this.isExistCookies()) return
    return this.cookies.get(key, configs)
  }

  public removeCookie(key?: string, configs?: any): StorageOperation | undefined {
    if (!this.isExistCookies()) return
    this.cookies.remove(key, configs)
    return this
  }

  public getJSONCookie(key?: string): any {
    if (!this.isExistCookies()) return
    return this.cookies.getJSON(key)
  }
}

export class NumberOperation extends StorageOperation {
  constructor(configs?: utilsConfigs) {
    super(configs)
  }
  /**
     * 格式化数据
     * @param { val : string }
     * @returns str
     */
  // 将数字过滤为每三位逗号隔开
  public tostr3(val: BaseNS) {
    return parseFloat(val as string).toLocaleString()
  }

  // 将数字保留两位小数
  public tostr2(val: BaseNS): BaseNS {
    let isNumber = this.isNumber(val)
    if (val && isNumber) {
      let tempVal = Number(val)
      return tempVal.toFixed(2)
    } else {
      return val
    }
  }

  // 将数字过滤为每三位逗号间隔并保留两位小数
  public tostr32(val: BaseNS) {
    let tempVal = Number(val)
    return tempVal.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  }

  /**
    * 隐藏手机中间/后四位
    */
  public phoneHide(tel: BaseNS, type: string) {
    let tempTel = String(tel)
    let phone
    if (type == 'mid') {
      phone = tempTel.replace(tempTel.substring(3, 7), '****')
    } else if (type == 'end') {
      phone = tempTel.replace(tempTel.substring(7, 11), '****')
    }
    return phone
  }

  public isNumber(param: any): boolean {
    return !isNaN(parseFloat(param)) &&
      isFinite(param)
  }
}

export class ESNext extends NumberOperation {
  constructor(configs?: utilsConfigs) {
    super(configs)
  }
  /**
    * 数组根据数组对象中的某个属性值进行排序的方法
    * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
    * @method sortBy
    * @param { attr: string, rev: boolean } { 排序属性,排序方式: true ↑ false ↓ }
    * @retunrs function
    */
  public sortBy({ attr, rev = true }: any) {
    rev = rev ? 1 : -1
    return function(a: any, b: any) {
      a = a[attr]
      b = b[attr]
      if (a < b) {
        return rev * -1
      }
      if (a > b) {
        return rev * 1
      }
      return 0
    }
  }

  /**
  * @method catchNull:.?实现
  * @param { json | js } root
  * @param { string } next
  * @param { any } defaultParam
  * @returns { json | js }
  */
  public catchNull(root: any, next: string, defaultParam: any): any {
    let val: any = null
    let keys: Array<any> = []
    keys = next.split('.')
    // 根部判断
    if (root) {
      // 键 List 循环
      for (let i = 0; i < keys.length; i++) {
        let current: any = null
        // 键判断是否包含[index]
        if (keys[i].indexOf('[') > -1) {
          // 处理键中有[index]的情况
          let [specialKey]: Array<BaseNS> = keys[i].split('[')
          let strArr: Array<string> = keys[i].split('[')
          strArr.shift()
          // 添加 next keys 是否为纯属组的判断
          let tempCurrent: any = specialKey ? root[specialKey] : root
          let normalGetTimes: number = 0 // 是否正常完成[index]循环

          for (let g = 0; g < strArr.length; g++) {
            let [index]: Array<BaseNS> = strArr[g].split(']')
            if (tempCurrent) {
              tempCurrent = tempCurrent[index]
              normalGetTimes++
            } else {
              break
            }
          }
          current = normalGetTimes === strArr.length ? tempCurrent : undefined
        } else {
          current = root[keys[i]]
        }
        // 判断当前键值是否为空
        if (current) {
          root = val = current
        } else {
          (ImplicitParseFalseExcludes.includes(current) && (i == keys.length - 1)) ? (root = val = current) : (val = defaultParam)
          break
        }
      }
    } else {
      val = defaultParam
    }
    return val
  }

  /**
    * @method clearSuffix
    * @description 清楚文件后缀
    * @param str
    */
  public clearSuffix(str: string): string {
    let newStr: string = ''
    if (str.split('').reverse().join('').indexOf('.') !== -1) {
      // @ts-ignore
      newStr = str.split('').reverse().join('').split('.').pop().split('').reverse().join('')
    } else {
      newStr = str
    }
    return newStr
  }

  /**
    * @method strStringSuffix
    * @description 截取文件后缀
    * @param str
    */
  public strStringSuffix(str: string): string {
    let newStr: any = ''
    if (str.indexOf('.') !== -1) {
      [newStr] = str.split('.').reverse()
    } else {
      newStr = str
    }
    return newStr.toLocaleLowerCase()
  }

  /**
    *
    * @method throttle
    * @description 节流构造函数
    * @param func
    * @param time
    * @param option
    * @returns { _throttle }
    */
  public throttle(
    func: (...params: any) => any,
    time = 20,
    option = {
      leading: true, // 首次是否执行
      trailing: false, // 计时结束是否执行最后一次
      context: null // this
    }
  ) {
    let timer: any
    let previous = new Date(0).getTime()
    const _throttle = (...args: []) => {
      let now = new Date().getTime()
      if (!option.leading) {
        if (timer) return
        timer = setTimeout(() => {
          timer = undefined
          func.apply(option.context, args)
        }, time)
      } else if (now - previous > time) {
        func.apply(option.context, args)
        previous = now
      } else if (option.trailing) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(option.context, args)
        }, time)
      }
    }
    _throttle.cancel = () => {
      previous = 0
      clearTimeout(timer)
      timer = undefined
    }
    return _throttle
  }

  /**
    * @method debounce
    * @description 防抖构造函数
    * @param func
    * @param time
    * @param option
    * @returns { _debounce }
    */
  public debounce(
    func: (...params: any) => any,
    time: number | undefined,
    option = {
      leading: true,
      context: null
    }
  ) {
    let timer: any = null
    const _debounce = (...arg: []) => {
      if (timer) {
        clearTimeout(timer)
      }
      if (option.leading && !timer) {
        timer = setTimeout(() => {
          timer = null
        }, time)
        func.apply(option.context, arg)
      } else {
        timer = setTimeout(() => {
          func.apply(option.context, arg)
          timer = null
        }, time)
      }
    }
    _debounce.cancel = () => {
      clearTimeout(timer)
      timer = null
    }
    return _debounce
  }

  // public setCookie(
  //   name: string,
  //   value: string,
  //   expires: number,
  //   domain: string,
  //   path: string,
  //   secure: string
  // ) {
  //   let cookieText = ''
  //   cookieText += encodeURIComponent(name) + '=' + encodeURIComponent(value)
  //   if (expires) {
  //     let exp = new Date()
  //     exp.setTime(exp.getTime() + expires * 24 * 60 * 60 * 1000)
  //     cookieText += '; expires=' + exp.toUTCString()
  //   }
  //   if (domain) {
  //     cookieText += '; domain=' + domain
  //   }
  //   if (path) {
  //     cookieText += '; path=' + path
  //   }
  //   if (secure) {
  //     cookieText += '; secure'
  //   }
  //   document.cookie = cookieText
  // }

  public browserMode(type: string): boolean {
    const userAgent = navigator.userAgent.toLocaleLowerCase()
    if (type === BrowserType.weChat) {
      return RegWeChat.test(userAgent)
    }
    return false
  }

  public copy<T>(resource: T): T {
    return JSON.parse(JSON.stringify(resource))
  }

  public static typeOfAny(resource: any, type: DataType): boolean {
    return Object.prototype.toString.call(resource) === type
  }

  public equals(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  public sleep(time: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('200 OK')
      }, time * 1000)
    })
  }

  /**
    * @method turnToUrlQuery
    * @description 将对象转为 url Query
    * @param resource
    * @returns query
    */
  public turnToUrlQuery(resource: any): string {
    return new URLSearchParams(resource).toString()
  }

  /**
   * @method removeDuplicates
   * @description 复杂数据类型数组去重
   * @param resource
   * @returns Array<T>
   */
  public removeDuplicates<T>(resource: Array<T>, useKey: string = 'id'): Array<T> {
    if (resource.length === 0) {
      return resource
    }
    let preDuplicatesKeys: Array<BaseNS> = []
    let keys: Array<BaseNS> = []
    preDuplicatesKeys = resource.map((item: any) => item[useKey])
    keys = [...new Set(preDuplicatesKeys)]
    if (keys.length === preDuplicatesKeys.length) {
      return resource
    }
    return resource.filter((item: any) => {
      let index = keys.indexOf(item[useKey])
      if (index != -1) {
        keys.splice(index, 1)
        return true
      } else {
        return false
      }
    })
  }

  /**
     * 递归获取选中菜单的id
     * @type {Array}
     */
  public recursionGetTreeIds(resource: Array<any>, key: string = 'id', children: string = 'sonNode') {
    let Ids = []
    if (resource.length > 0) {
      for (let i = 0; i < resource.length; i++) {
        Ids.push(resource[i][key])
        if (resource[i][children]) {
          Ids = Ids.concat(this.recursionGetTreeIds(resource[i][children]))
        }
      }
    }
    return Ids
  }

  public recursionGetTreeLeafIds(resource: Array<any>, key: string = 'id', children: string = 'sonNode') {
    let Ids = []
    if (resource.length > 0) {
      for (let i = 0; i < resource.length; i++) {
        if (resource[i][children]) {
          Ids = Ids.concat(this.recursionGetTreeLeafIds(resource[i][children]))
        } else {
          Ids.push(resource[i][key])
        }
      }
    }
    return Ids
  }

  public recursionGetTreeItemById(resource: Array<any>, value: BaseNS, key: string = 'meta.key', children: string = 'children') {
    let result = null
    for (let i = 0; i < (resource && resource.length || 0); i++) {
      let item = resource[i]
      if (this.catchNull(item, key, '') == value) {
        result = item
        break
      }
      if (item[children] && item[children]['length'] !== 0) {
        result = this.recursionGetTreeItemById(item[children], value)
        if (result) {
          break
        }
      }
    }
    return result
  }

  public recursionGetTreeMap(resource: Array<any>, key: string = 'meta.key', value: string = 'path', children: string = 'children') {
    let result = {}
    for (let i = 0; i < resource.length; i++) {
      let item = resource[i]
      result[this.catchNull(item, key, '')] = item[value]
      if (item[children]) {
        result = { ...result, ...this.recursionGetTreeMap(item[children]) }
      }
    }
    return result
  }

  public arrayBufferToBase64(buffer, type: string = 'image/png') {
    return `data:${type};base64,${window.btoa(String.fromCharCode(...new Uint8Array(buffer)))}`
  }

  public arrayBufferToExcel(buffer, fileName: string = 'fileName') {
    var uInt8Array = new Uint8Array(buffer) // 先将返回的二进制数组转化为js的二进制数组
    let blob = new Blob([uInt8Array], { type: 'application/vnd.ms-excel' })// 然后创建blob对象，文件类型设置为excel的类型
    let blobURL = window.URL.createObjectURL(blob)// 然后创建一个可访问的URL
    let tempLink = document.createElement('a')// 创建a标签去下载
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', fileName)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }

  public arrayBufferToJSON(buffer): string {
    var uInt8Array = new Uint8Array(buffer)
    var out, i, len, c
    var char2, char3

    out = ''
    len = uInt8Array.length
    i = 0
    while (i < len) {
      c = uInt8Array[i++]
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c)
          break
        case 12: case 13:
          // 110x xxxx 10xx xxxx
          char2 = uInt8Array[i++]
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = uInt8Array[i++]
          char3 = uInt8Array[i++]
          out += String.fromCharCode(((c & 0x0F) << 12) |
    ((char2 & 0x3F) << 6) |
    ((char3 & 0x3F) << 0))
          break
      }
    }

    return out
  }

  public regexpTest(regexp: RegExp, val: string): boolean {
    return regexp.test(val)
  }
}

export class DOMOperation extends ESNext {
  constructor(configs?: utilsConfigs) {
    super(configs)
  }
  // 页面平滑滚动
  public scrollTop(number = 0, time: number = 0) {
    if (!time) {
      document.body.scrollTop = document.documentElement.scrollTop = number
      return number
    }
    const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime // 计算循环的次数
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
    let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--
        this.scrollTop((nowTop += everTop))
      } else {
        clearInterval(scrollTimer) // 清除计时器
      }
    }, spacingTime)
  }

  public getOffsetByBody(el: any, attr: string = 'offsetLeft'): number {
    let offset = 0
    while (el && el.tagName !== 'BODY') {
      offset += el[attr]
      el = el.offsetParent
    }
    return offset
  }

  public getDOMDeep(ele: string = 'body'): number {
    // @ts-ignore
    const getDepth = node => {
      if (!node.children || node.children.length === 0) {
        return 1
      }
      const maxChildrenDepth: any = [...node.children].map(v => getDepth(v))
      return 1 + Math.max(...maxChildrenDepth)
    }
    return getDepth(document.querySelector(ele))
  }
}

export class RouterOperation extends DOMOperation {
  private readonly router: VueRouter

  constructor(configs?: utilsConfigs) {
    super(configs)
    // @ts-ignore
    this.router = configs && configs.router
  }

  public routesMapper(source: Array<any>): Array<RouteConfig> {
    if (!(source && Array.isArray(source) && source.length !== 0)) {
      return []
    }
    return source
      .filter(item => item.routeAddr)
      .map(item => ({
        ...item,
        meta: item.meta ? JSON.parse(item.meta) : {},
        sonNode: item.sonNode && item.sonNode.length !== 0 && item.sonNode[0].perType != ResourceType.button ? item.sonNode : null
      }))
      .map(item => ({
        path: item.routeAddr,
        component: item.component,
        redirect: item.meta.redirect || '',
        alias: item.meta.alias || '',
        meta: { ...item.meta, icon: item.icon, key: item.perKey },
        children: item.sonNode && this.routesMapper(item.sonNode)
      }))
  }

  public generateAsyncRoutes<T>(routes: Array<T>): Array<T> {
    let resultRoutes = []
    resultRoutes = routes.map((item: any) => {
      let newItem: any = {
        ...item,
        component: item.component ? () => import(/* webpackChunkName: "[request]" */ `@/views/${item.component}.vue`) : Layout
      }
      // 子路由也需要挂载 component
      newItem.children && (newItem.children = this.generateAsyncRoutes(newItem.children))
      return newItem
    })
    return resultRoutes
  }

  public resolveNewTab(route: RawLocation, router?: VueRouter, target = '_blank'): void {
    let operation = this.router || router
    let resultRoute = route
    // @ts-ignore
    // '1' 为使用, '0' 为禁用
    resultRoute.query.useQueryParams = '1'

    let { href } = operation.resolve(route)
    window.open(href, target)
  }
}

export class DateOperation extends RouterOperation {
  public formatDate(time: BaseNS, formatValue: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return time && moment(time).format(formatValue)
  }
}

export class ProjectSelf extends DateOperation {
  constructor(configs?: utilsConfigs) {
    super(configs)
  }
  /**
    * @method ItemCheckedChange
    * @description 列表单项 checked 变化控制 allChecked 值
    * @param { required, string } allKey 控制 allChecked 字段
    * @param { required, string } dataKey 列表 list 字段
    * @param { string } itemKey item checked 字段
    * @param { required, Vue instance } that this
    */
  public ItemCheckedChange({ allKey, itemKey = 'checked', dataKey, that }: any): void {
    let arr = this.catchNull(that, dataKey, [])
    let result = arr.reduce((res: number, item: any) => res + item[itemKey], 0)
    that[allKey] = result === arr.length
  }

  public exportExcel(response) {
    let fileName = response.headers['content-disposition'].split(';').find(item => item.indexOf('filename') !== -1).split('filename=')[1]
    this.arrayBufferToExcel(response.data, fileName)
  }
}

export class Utils extends ProjectSelf {
  constructor(configs?: utilsConfigs) {
    super(configs)
  }

  public toast(type: any, message: any, duration: any): void {
    // Toast({
    //   type: type || 'text',
    //   message: message,
    //   duration: duration || 1500,
    // })
  }
}

export class Directive {
  public binding: { value: Array<number> | number; arg: string; modifiers: any }
  constructor(binding: { value: Array<number> | number; arg: string; modifiers: any }) {
    this.binding = binding
  }

  static constructBinding(value: any, arg: string = '', modifiers: any = {}, name: string = 'permission'): IDirectiveBinding {
    return {
      arg,
      modifiers,
      value,
      name,
      rawName: arg ? `v-${name}:${arg}` : `v-${name}`
    }
  }
}

export class PermissionDirective extends Directive {
  public userType: number
  public permissionArgs: any

  constructor(binding: any, userType: number = 0) {
    super(binding)
    this.userType = userType
    this.permissionArgs = PermissionArgs
  }

  static turnToBinaryPermissionSum(value: BaseNS): Array<number> {
    // 转为二进制
    let binary = parseInt(value as string, 10).toString(2).split('').reverse().join('')
    let multiplier = 1
    let permissionList = []
    for (let i = 0; i < binary.length; i++) {
      // 如果位数为 1 则代表有值, 8421 权限控制, 当前位置有值则有当前倍率的权限
      (binary[i] === '1') && permissionList.push(multiplier)
      multiplier *= 2
    }
    return permissionList
  }

  protected exact(): boolean {
    return this.binding.value === this.userType
  }

  protected inverse(): boolean {
    return this.binding.value !== this.userType
  }

  protected includes(): boolean {
    return (this.binding.value as Array<number>).includes(this.userType)
  }

  protected excludes(): boolean {
    return !(this.binding.value as Array<number>).includes(this.userType)
  }

  public result(userType: number = this.userType): boolean {
    this.userType = userType
    let {
      exact,
      inverse,
      includes,
      excludes
    } = PermissionArgs
    let result: boolean = true

    switch (this.binding.arg) {
      case exact:
        result = this.exact()
        break
      case inverse:
        result = this.inverse()
        break
      case includes:
        result = this.includes()
        break
      case excludes:
        result = this.excludes()
        break
      default:
        if (ESNext.typeOfAny(this.userType, DataType.number)) {
          result = this.exact()
        } else if (ESNext.typeOfAny(this.userType, DataType.array)) {
          result = this.includes()
        }
    }

    return result
  }
}

export interface recursionSortRoutesParams {
  resource: any,
  sortFn?: (...args: any) => number
  childrenKey?: string
  filterRoutes?: Array<any>
}

export interface utilsConfigs {
  router?: VueRouter,
  cookies?: any
}

export default {
  install(Vue: VueConstructor, configs: utilsConfigs) {
    Vue.prototype.$utils = new Utils(configs)
  }
}
