import { asyncAddRoutes } from '@/plugins/router'
import { UserModule } from '@/plugins/store/modules/user'
import { RouteConfig } from 'vue-router/types'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Utils } from '@/plugins/utils'
import store from '@/plugins/store'

export interface IPermissionState {
  dynamicRoutes: Array<RouteConfig>,
  keyPathMap: any,
}
@Module({ dynamic: true, store, name: 'permission' })
class App extends VuexModule implements IPermissionState {
  public dynamicRoutes = []

  get keyPathMap() : any {
    return new Utils().recursionGetTreeMap(this.dynamicRoutes)
  }

  @Mutation
  public SET_DYNAMICROUTES(dynamicRoutes: Array<RouteConfig>) {
    this.dynamicRoutes = dynamicRoutes
  }

  @Action
  public AsyncAddRoutes() {
    const utils = new Utils()
    this.SET_DYNAMICROUTES(utils.generateAsyncRoutes(utils.routesMapper(UserModule.userInfo.perList)))
    asyncAddRoutes(this.dynamicRoutes)
  }
}

export const AppModule = getModule(App)
