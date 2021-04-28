import { DataType } from '@/configs/const';
import { BaseNS, IDirectiveBinding } from '@/type';
import VueRouter, { RawLocation, RouteConfig } from 'vue-router/types';
import { VueConstructor } from 'vue';
import { IUtilsConfigs } from '@/plugins/utils';
export declare class StorageOperation {
    private readonly cookies;
    constructor(configs?: IUtilsConfigs);
    /**
     * 设置本地缓存
     * @param { key: str , val: any }
     * @retunrs true: bool
     */
    setS<T>({ key, val }: {
        key: string;
        val: T;
    }): string;
    /**
     * 读取本地缓存
     * @param key
     * @retunrs *: any
     */
    getS(key?: string): string | Record<string, unknown>;
    /**
     * 删除本地缓存
     * @param key
     * @returns {}
     */
    removeS(key?: string): this;
    isExistCookies(): boolean;
    setCookie(key: string, val: any, configs?: any): any;
    getCookie(key?: string, configs?: any): any;
    removeCookie(key?: string, configs?: any): StorageOperation | undefined;
    getJSONCookie(key?: string): any;
}
export declare class NumberOperation extends StorageOperation {
    constructor(configs?: IUtilsConfigs);
    /**
       * 格式化数据
       * @param { val : string }
       * @returns str
       */
    tostr3(val: BaseNS): string;
    tostr2(val: BaseNS): BaseNS;
    tostr32(val: BaseNS): string;
    /**
      * 隐藏手机中间/后四位
      */
    phoneHide(tel: BaseNS, type: string): any;
    isNumber(param: any): boolean;
}
export declare class ESNext extends NumberOperation {
    constructor(configs?: IUtilsConfigs);
    /**
      * 数组根据数组对象中的某个属性值进行排序的方法
      * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
      * @method sortBy
      * @param { attr: string, rev: boolean } { 排序属性,排序方式: true ↑ false ↓ }
      * @retunrs function
      */
    sortBy({ attr, rev }: any): (a: any, b: any) => number;
    /**
    * @method catchNull:.?实现
    * @param { json | js } root
    * @param { string } next
    * @param { any } defaultParam
    * @returns { json | js }
    */
    catchNull(root: any, next: string, defaultParam: any): any;
    /**
      * @method clearSuffix
      * @description 清楚文件后缀
      * @param str
      */
    clearSuffix(str: string): string;
    /**
      * @method strStringSuffix
      * @description 截取文件后缀
      * @param str
      */
    strStringSuffix(str: string): string;
    /**
      *
      * @method throttle
      * @description 节流构造函数
      * @param func
      * @param time
      * @param option
      * @returns { _throttle }
      */
    throttle(func: (...params: any) => any, time?: number, option?: {
        leading: boolean;
        trailing: boolean;
        context: any;
    }): {
        (): void;
        cancel(): void;
    };
    /**
      * @method debounce
      * @description 防抖构造函数
      * @param func
      * @param time
      * @param option
      * @returns { _debounce }
      */
    debounce(func: (...params: any) => any, time: number | undefined, option?: {
        leading: boolean;
        context: any;
    }): {
        (): void;
        cancel(): void;
    };
    browserMode(type: string): boolean;
    copy<T>(resource: T): T;
    static typeOfAny(resource: any, type: DataType): boolean;
    equals(obj1: any, obj2: any): boolean;
    sleep(time?: number): Promise<any>;
    /**
      * @method turnToUrlQuery
      * @description 将对象转为 url Query
      * @param resource
      * @returns query
      */
    turnToUrlQuery(resource: any): string;
    /**
     * @method removeDuplicates
     * @description 复杂数据类型数组去重
     * @param resource
     * @returns Array<T>
     */
    removeDuplicates<T>(resource: Array<T>, useKey?: string): Array<T>;
    /**
       * 递归获取选中菜单的id
       * @type {Array}
       */
    recursionGetTreeIds(resource: Array<any>, key?: string, children?: string): any[];
    recursionGetTreeLeafIds(resource: Array<any>, key?: string, children?: string): any[];
    recursionGetTreeItemById(resource: Array<any>, value: BaseNS, key?: string, children?: string): any;
    recursionGetTreeMap(resource: Array<any>, key?: string, value?: string, children?: string): {};
    arrayBufferToBase64(buffer: any, type?: string): string;
    arrayBufferToExcel(buffer: any, fileName?: string): void;
    arrayBufferToJSON(buffer: any): string;
    regexpTest(regexp: RegExp, val: string): boolean;
}
export declare class DOMOperation extends ESNext {
    constructor(configs?: IUtilsConfigs);
    scrollTop(number?: number, time?: number): number;
    getOffsetByBody(el: any, attr?: string): number;
    getDOMDeep(ele?: string): number;
    hasClass(ele: HTMLElement, className: string): boolean;
    addClass(ele: HTMLElement, className: string): void;
    removeClass(ele: HTMLElement, className: string): void;
    toggleClass(ele: HTMLElement, className: string): void;
}
export declare class RouterOperation extends DOMOperation {
    private readonly router;
    constructor(configs?: IUtilsConfigs);
    routesMapper(source: Array<any>): Array<RouteConfig>;
    generateAsyncRoutes<T>(routes: Array<T>): Array<T>;
    resolveNewTab(route: RawLocation, router?: VueRouter, target?: string): void;
}
export declare class DateOperation extends RouterOperation {
    formatDate(time: BaseNS, formatValue?: string): string;
}
export declare class ProjectSelf extends DateOperation {
    constructor(configs?: IUtilsConfigs);
    /**
      * @method ItemCheckedChange
      * @description 列表单项 checked 变化控制 allChecked 值
      * @param { required, string } allKey 控制 allChecked 字段
      * @param { required, string } dataKey 列表 list 字段
      * @param { string } itemKey item checked 字段
      * @param { required, Vue instance } that this
      */
    ItemCheckedChange({ allKey, itemKey, dataKey, that }: any): void;
    exportExcel(response: any): void;
}
export declare class Utils extends ProjectSelf {
    constructor(configs?: IUtilsConfigs);
    toast(type: any, message: any, duration: any): void;
}
export declare class Directive {
    binding: {
        value: Array<number> | number;
        arg: string;
        modifiers: any;
    };
    constructor(binding: {
        value: Array<number> | number;
        arg: string;
        modifiers: any;
    });
    static constructBinding(value: any, arg?: string, modifiers?: any, name?: string): IDirectiveBinding;
}
export declare class PermissionDirective extends Directive {
    userType: number;
    permissionArgs: any;
    constructor(binding: any, userType?: number);
    static turnToBinaryPermissionSum(value: BaseNS): Array<number>;
    protected exact(): boolean;
    protected inverse(): boolean;
    protected includes(): boolean;
    protected excludes(): boolean;
    result(userType?: number): boolean;
}
declare const _default: {
    install(Vue: VueConstructor, configs: any): void;
};
export default _default;
