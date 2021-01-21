import { AppModule } from '@/plugins/store/modules/app'
import { _$PageType, _$DictType } from '@/configs/const/views'
import { Vue, Component } from 'vue-property-decorator'
import { PermissionModule } from '@/plugins/store/modules/permission'
@Component
export default class Base extends Vue {
  public home() {
    this.$router.push('/')
  }

  public _$routerPush(key: string, query = {}) {
    this.$router.push({ path: PermissionModule.keyPathMap[key], query })
  }

  get _$pageType() {
    return _$PageType
  }

  get ISADD(): boolean {
    // @ts-ignore
    return this.data.pageType === this._$pageType.add
  }

  get _$DictType() {
    return _$DictType
  }
}
