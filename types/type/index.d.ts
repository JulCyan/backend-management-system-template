
declare module '@/type' {
    export type BaseNS = number | string
    export type PackNS = number | string
    export type ArrayNS = Array<BaseNS>

    export interface IFormValidate {
        (rule: any, value: any, callback: any): void;
    }

    export interface IValidateKeys {
        formKey: string;
        beginKey: string;
        endKey: string;
        limitDays?: number;
    }

    export interface IDirectiveBinding {
        arg: string;
        value: number | Array<number>;
        name: string;
        rawName: string;
        modifiers: any;
        [propName: string]: any;
    }
}