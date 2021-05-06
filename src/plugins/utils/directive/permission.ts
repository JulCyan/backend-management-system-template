
import { ObjToStringReturns } from '@/configs/const'
import { ESNext } from '@/plugins/utils'
import { BaseNS } from '@/type'
import { Directive } from '.'
export enum PermissionArgs {
  exact = 'exact',
  inverse = 'inverse',
  includes = 'includes',
  excludes = 'excludes',
}

export class PermissionDirective extends Directive {
  static _name = 'permission'
  public userType: number
  public permissionArgs: any

  constructor(binding: any, userType = 0) {
    super(binding)
    this.userType = userType
    this.permissionArgs = PermissionArgs
  }

  static turnToBinaryPermissionSum(value: BaseNS): Array<number> {
    // 转为二进制
    const binary = parseInt(value as string, 10).toString(2)
      .split('')
      .reverse()
      .join('')
    let multiplier = 1
    const permissionList = []
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

  handler(userType: number = this.userType): boolean {
    this.userType = userType
    const {
      exact,
      inverse,
      includes,
      excludes
    } = PermissionArgs
    let result = true

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
        if (ESNext.typeofAny(this.userType, ObjToStringReturns.number)) {
          result = this.exact()
        } else if (ESNext.typeofAny(this.userType, ObjToStringReturns.array)) {
          result = this.includes()
        }
    }

    return result
  }
}
