import { ServerErrorBusinessStatus, SuccessBusinessStatus, UnauthorizedBusinessStatus, NoPermissionBusinessStatus } from '@/configs/const'
import { BaseNS, IBusinessData, ImplementAxiosResponse } from '@/type'
import { msg } from '@/plugins/message'
import { UserModule } from '@/plugins/store/modules'
import { AjaxResponseService, DefaultResponse } from './http-status'

// 抽象 Business ResponseService
export abstract class BusinessResponseService implements AjaxResponseService {
    abstract handler(response: ImplementAxiosResponse): void | IBusinessData
}

// Business 成功状态码 ResponseService
export class SuccessBusinessStatusService implements BusinessResponseService {
  handler(response: ImplementAxiosResponse): void | IBusinessData {
    const businessResponse: IBusinessData = response.data
    const { code, state, message } = businessResponse
    !state && msg({
      type: 'success',
      message
    })
    return response.data
  }
}

// Business 服务器错误 ResponseService
export class ServerErrorBusinessStatusService implements BusinessResponseService {
  handler(response: ImplementAxiosResponse): void | IBusinessData {
    const businessResponse: IBusinessData = response.data
    const { code, state, message } = businessResponse
    !state && msg({
      type: 'error',
      message
    })
    return businessResponse
  }
}

// Business 鉴权错误 ResponseService
export class UnauthorizedBusinessStatusService implements BusinessResponseService {
  handler(response: ImplementAxiosResponse): void | IBusinessData {
    UserModule.ResetToken()
    location.reload()
  }
}

// Business 权限限制 ResponseService
export class NoPermissionBusinessStatusService implements BusinessResponseService {
  handler(response: ImplementAxiosResponse): void | IBusinessData {
    const businessResponse: IBusinessData = response.data
    const { code, state, message } = businessResponse
    !state && msg({
      type: 'error',
      message,
      onClose: () => {
        location.href = '/'
      }
    })
  }
}

// Business 其他 ResponseService
export class OthersBusinessStatusService implements BusinessResponseService {
  handler(response: ImplementAxiosResponse): void | IBusinessData<any> {
    let businessResponse: IBusinessData = response.data
    const { code, state, message } = businessResponse
    !state && msg({
      type: 'warning',
      message
    })
    businessResponse = DefaultResponse
    return businessResponse
  }
}

// Business Status 策略分发
export class BusinessStatusServicesFactory {
    private static handlerMap: Map<Array<BaseNS> | undefined, AjaxResponseService> = new Map([
      [SuccessBusinessStatus, new SuccessBusinessStatusService()],
      [ServerErrorBusinessStatus, new ServerErrorBusinessStatusService()],
      [UnauthorizedBusinessStatus, new UnauthorizedBusinessStatusService()],
      [NoPermissionBusinessStatus, new NoPermissionBusinessStatusService()],
      [undefined, new OthersBusinessStatusService()]
    ])

    static getStatusService(response: ImplementAxiosResponse): AjaxResponseService {
      // 根据 http status 找到对应状态码组
      const handlerMapKey = [
        SuccessBusinessStatus,
        ServerErrorBusinessStatus,
        UnauthorizedBusinessStatus,
        NoPermissionBusinessStatus
      ].find(item => item.includes(response.status))

      return this.handlerMap.get(handlerMapKey)
    }
}
