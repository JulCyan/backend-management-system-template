import { ErrorLogModule } from '@/plugins/store/modules'
import { ESNext } from '@/plugins/utils'
import settings from '@/settings.json'
import { ObjToStringReturns } from '@/configs/const'

const { errorLog: needErrorLog } = settings

const checkNeed = () => {
  const env = process.env.NODE_ENV
  if (ESNext.typeofAny(needErrorLog, ObjToStringReturns.array) && env) {
    return needErrorLog.includes(env)
  }
  return false
}

export default {
  install(Vue) {
    if (checkNeed()) {
      Vue.config.errorHandler = function(err, vm, info) {
        ErrorLogModule.AddErrorLog({
          err,
          vm,
          info,
          url: window.location.href
        })
      }
    }
  }
}
