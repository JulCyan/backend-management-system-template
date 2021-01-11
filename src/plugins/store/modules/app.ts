import { asyncAddRoutes } from '@/plugins/router'
import { UserModule } from '@/plugins/store/modules/user'
import { RouteConfig } from 'vue-router/types'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus } from '@/plugins/cookies'
import { Utils } from '@/plugins/utils'
import store from '@/plugins/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  dynamicRoutes: Array<RouteConfig>,
  keyPathMap: any,
  baseURL: string
}
@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public dynamicRoutes = []
  public baseURL = process.env.VUE_APP_API_URL + process.env.VUE_APP_PREFIX

  get keyPathMap() : any {
    return new Utils().recursionGetTreeMap(this.dynamicRoutes)
  }

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  public SET_DYNAMICROUTES(dynamicRoutes: Array<RouteConfig>) {
    this.dynamicRoutes = dynamicRoutes
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public AsyncAddRoutes() {
    const utils = new Utils()
    this.SET_DYNAMICROUTES(utils.generateAsyncRoutes(utils.routesMapper(UserModule.userInfo.perList)))
    asyncAddRoutes(this.dynamicRoutes)
  }
}

export const AppModule = getModule(App)
