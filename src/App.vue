<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/plugins/store/modules/user'
import { PermissionModule } from '@/plugins/store/modules/permission'
import { asyncAddRoutes, LocalRoutes } from './plugins/router'

@Component({
  name: 'App'
})
export default class App extends Vue {
  protected async created() {
    let redirect = window.location.href.split('#')[1]
    this.$router.push('/')
    if (UserModule.token) {
      await UserModule.getUserInfo()
      await PermissionModule.AsyncAddRoutes()
    } else {
      PermissionModule.SET_DYNAMICROUTES(LocalRoutes)
      asyncAddRoutes(LocalRoutes)
    }
    this.$router.push({
      path: redirect === '/404' ? '/' : redirect
    })
  }
}
</script>
