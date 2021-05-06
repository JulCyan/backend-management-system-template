import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/plugins/store'
import elementVariables from '@/styles/_variables.scss'
import $settings from '@/settings.json'

export interface ISettingsState {
  theme: string;
  fixedHeader: boolean;
  showSettings: boolean;
  showTagsView: boolean;
  showSidebarLogo: boolean;
  sidebarTextTheme: boolean;
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements ISettingsState {
  public $settings = $settings
  public theme = elementVariables.theme
  public fixedHeader = $settings.fixedHeader
  public showSettings = $settings.showSettings
  public showTagsView = $settings.showTagsView
  public showSidebarLogo = $settings.showSidebarLogo
  public sidebarTextTheme = $settings.sidebarTextTheme

  @Mutation
  private CHANGE_SETTING(payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
      document.getElementsByTagName('body')[0].style.setProperty('--theme', value)
    }
  }

  @Action
  public ChangeSetting(payload: { key: string; value: any}) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Settings)
