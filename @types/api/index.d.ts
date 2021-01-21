declare module '@/api' {
    import { AxiosRequestConfig } from 'axios'
    export interface IRequestFunc {
        (...args: any): AxiosRequestConfig
    }
}
