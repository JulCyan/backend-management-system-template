declare module '@/type' {
    import { AxiosResponse } from 'axios'

    // 业务 data
    export interface IBusinessData<T = any> {
        code: number;
        message: string;
        data: T
        state: boolean;
    }

    export type ImplementAxiosResponse = AxiosResponse<IBusinessData>

    // 正常的返回的 response 与业务数据
    export type IAxiosResponsePromise = Promise<ImplementAxiosResponse>

    // 由拦截器返回的 response.data
    export type IAxiosBusinessResponsePromise = Promise<IBusinessData>
    // rename
    export type IAxiosRewriteResponsePromise = IAxiosBusinessResponsePromise

    // 提供给 vm-property 的 vue 实例属性
    export interface IExtensionAxiosResponse extends IBusinessData, AxiosResponse { }
    export type IExtensionAxiosResponsePromise = Promise<IExtensionAxiosResponse>
}