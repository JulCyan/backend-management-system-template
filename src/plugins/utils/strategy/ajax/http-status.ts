import { ServerErrorHttpStatus, SuccessHttpStatus, UnauthorizedHttpStatus } from '@/configs/const'
import { BaseNS, IBusinessData, ImplementAxiosResponse } from '@/type'
import { UserModule } from '@/plugins/store/modules'
import { BusinessStatusServicesFactory } from './business-status'
import { msg } from '@/plugins/message'
export const DefaultResponse: IBusinessData | any = {}

// 抽象 ResponseService
export abstract class AjaxResponseService {
  abstract handler(response: any): any
}

// 抽象 Http ResponseService
export abstract class HttpResponseService implements AjaxResponseService {
  abstract handler(response: ImplementAxiosResponse): ImplementAxiosResponse | IBusinessData
}

// Http 成功状态码 ResponseService
export class SuccessHttpStatusService implements HttpResponseService {
  handler(response: ImplementAxiosResponse): ImplementAxiosResponse | IBusinessData {
    if (['arraybuffer'].includes(response?.request?.responseType)) {
      return response
    }
    return BusinessStatusServicesFactory.getStatusService(response).handler(response)
  }
}

// Http 服务器错误 ResponseService
export class ServerErrorHttpStatusService implements HttpResponseService {
  handler(response: ImplementAxiosResponse): ImplementAxiosResponse {
    console.log('AxiosResponse', response)
    let { status, statusText, config: { url } } = response
    msg({
      type: 'error',
      message: `${status} ${statusText} Request Url: ${url}`,
      duration: 3 * 1000,
      closeAll: false
    })
    response.data = DefaultResponse
    return response
  }
}

// Http 鉴权错误 ResponseService
export class UnauthorizedHttpStatusService implements HttpResponseService {
  handler(response: ImplementAxiosResponse): ImplementAxiosResponse {
    UserModule.ResetToken()
    response.data = DefaultResponse
    setTimeout(() => {
      location.href = '/'
    })
    return response
  }
}

// Http 其他 ResponseService
export class OthersHttpStatusService extends ServerErrorHttpStatusService { }

// Http Status 策略分发
export class HttpStatusServicesFactory {
  private static handlerMap = new Map([
    [SuccessHttpStatus, new SuccessHttpStatusService()],
    [UnauthorizedHttpStatus, new UnauthorizedHttpStatusService()],
    [ServerErrorHttpStatus, new ServerErrorHttpStatusService()],
    [undefined, new OthersHttpStatusService()]
  ])

  static getStatusService(response: ImplementAxiosResponse): HttpResponseService {
    // 根据 http status 找到对应状态码组
    const handlerMapKey = [
      SuccessHttpStatus,
      UnauthorizedHttpStatus,
      ServerErrorHttpStatus
    ].find(item => item.includes(response.status))

    return this.handlerMap.get(handlerMapKey)
  }
}
