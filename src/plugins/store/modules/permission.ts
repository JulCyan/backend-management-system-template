import { asyncAddRoutes, WhiteRoutes } from '@/plugins/router'
import { UserModule } from '@/plugins/store/modules'
import { RouteConfig } from 'vue-router/types'
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Utils } from '@/plugins/utils'
import store from '@/plugins/store'

export interface IPermissionState {
  dynamicRoutes: Array<RouteConfig>
  keyPathMap: Map<string, string>
  routes: Array<RouteConfig>
}
@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public dynamicRoutes = []

  get keyPathMap() : any {
    return new Utils().recursionGetTreeMap(this.dynamicRoutes)
  }

  get routes() : any {
    return WhiteRoutes.concat(this.dynamicRoutes)
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

export const PermissionModule = getModule(Permission)
