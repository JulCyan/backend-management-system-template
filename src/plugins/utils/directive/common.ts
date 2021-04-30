import { IDirectiveBinding } from '@/type'

export abstract class Directive {
  static _name: string
  binding: { value: any | number; arg: string; modifiers: any }
  constructor(binding: { value: Array<number> | number; arg: string; modifiers: any }) {
    this.binding = binding
  }

  static constructBinding(value: any, arg = '', modifiers: any = {}, name = 'permission'): IDirectiveBinding {
    return {
      arg,
      modifiers,
      value,
      name,
      rawName: arg ? `v-${name}:${arg}` : `v-${name}`
    }
  }

  abstract handler(...arg: any): void
}
