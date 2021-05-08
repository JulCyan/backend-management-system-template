<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="
            item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          "
          class="no-redirect"
          >{{ breadcrumbGetter(item) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{
          breadcrumbGetter(item)
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import pathToRegexp from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'
import i18n, { getRouteTitle } from '@/plugins/lang' // Internationalization
@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = []

  @Watch('$route')
  private onRouteChange(route: Route) {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  created() {
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    const matched = this.$route.matched.filter(
      (item) => item.meta && getRouteTitle(item)
    )
    // const first = matched[0]
    // if (!this.isDashboard(first)) {
    //   matched = [
    //     { path: '/dashboard', meta: { title: 'Dashboard' } } as RouteRecord
    //   ].concat(matched)
    // }

    this.breadcrumbs = matched.filter((item) => {
      return (
        item.meta &&
        (item.meta.breadcrumb || item.meta.title) &&
        item.meta.useBreadcrumb !== false
      )
    })
  }

  private isDashboard(route: RouteRecord) {
    const name = route && route.meta && route.meta.title
    return name === 'Dashboard'
  }

  private pathCompile(path: string) {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = this.$route
    const toPath = pathToRegexp.compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    this.$router.push(this.pathCompile(path))
  }

  protected breadcrumbGetter(item) {
    let result = ''
    result =
      (item?.meta?.breadcrumb &&
        i18n.t(`${item.meta.breadcrumb}`).toString()) ||
      getRouteTitle(item)
    return result
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
