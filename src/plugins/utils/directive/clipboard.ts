import { ObjToStringReturns } from '@/configs/const'
import i18n from '@/plugins/lang'
import { msg } from '@/plugins/message'
import { BaseNS } from '@/type'
import Clipboard from 'clipboard'
import { Directive } from '.'
import { ESNext } from '..'

export enum ClipboardArgs {
  cut = 'cut',
  copy = 'copy'
}

export type Action = 'cut' | 'copy'
export interface ClipboardCallBack {
  (e: ClipboardJS.Event): void
}

export interface ClipboardBindingValue {
  value: BaseNS
  success?: ClipboardCallBack,
  error?: ClipboardCallBack,
}

export interface ClipboardBinding {
  value: ClipboardBindingValue | ClipboardBindingValue['value'];
  arg: ClipboardArgs;
  modifiers: any
}
export class ClipboardDirective extends Directive {
  static _name = 'clipboard'
  private instance: Clipboard
  private action: Action
  binding: ClipboardBinding
  private value: BaseNS

  constructor(binding: any) {
    super(binding)
    this.action = binding.arg
    this.assignValue()
  }

  // todo 销毁, 池, 优化
  static getInstance(binding) {
    return new ClipboardDirective(binding)
  }

  protected successCallback: ClipboardCallBack | 'default'

  protected errorCallback: ClipboardCallBack | 'default'

  static successCB(e) {
    msg({
      message: i18n.t('tips.clipboard.copySuccess').toString(),
      type: 'success'
    })
  }

  static errorCB(e) {
    msg({
      message: i18n.t('tips.clipboard.copyError').toString(),
      type: 'error'
    })
  }

  handler(el) {
    el.style.cursor = 'pointer'

    this.instance = new Clipboard(el, {
      text: () => this.value as string,
      action: () => this.action
    })

    this.instance.on('success', e => {
      if (this.successCallback == 'default') {
        ClipboardDirective.successCB(e)
        return
      }
      ((this?.successCallback) as ClipboardCallBack)(e)
    })

    this.instance.on('error', e => {
      if (this.errorCallback == 'default') {
        ClipboardDirective.errorCB(e)
        return
      }
      ((this?.errorCallback) as ClipboardCallBack)(e)
    })
  }

  protected assignValue() {
    if (ESNext.typeofAny(this.binding.value, ObjToStringReturns.object)) {
      let { value, success, error } = this.binding.value as ClipboardBindingValue
      this.value = value
      this.successCallback = success
      this.errorCallback = error
    } else {
      this.value = this.binding.value as BaseNS
    }
  }
}
