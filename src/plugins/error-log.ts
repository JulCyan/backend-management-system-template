import { ErrorLogModule } from '@/plugins/store/modules/error-log'
import { ESNext } from '@/plugins/utils'
import settings from '@/settings.json'
import { DataType } from '@/configs/const'

const { errorLog: needErrorLog } = settings

const checkNeed = () => {
  const env = process.env.NODE_ENV
  if (ESNext.typeOfAny(needErrorLog, DataType.array) && env) {
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
