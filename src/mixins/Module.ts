import { _isDev } from '@/configs/const/env'
import { Mixins, Component } from 'vue-property-decorator'
import { MixinForm } from '@/mixins'
import MixinExportExcel from '@/mixins/ExportExcel'
import { RealTimeData, IntegratedData, InfoBox, EXTable } from '@/components'
@Component({
  components: {
    RealTimeData,
    IntegratedData,
    InfoBox,
    EXTable
  }
})
export default class Module extends Mixins(MixinForm, MixinExportExcel) {
  protected _$setInterval(fn: Function, time: number = 30 * 1000) {
    fn()
    const timer = setInterval(() => {
      fn()
    }, _isDev ? 6 * 1000 : time)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  }
}
