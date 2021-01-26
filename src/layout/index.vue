<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div
      :class="{hasTagsView: showTagsView}"
      class="main-container"
    >
      <div :class="{'fixed-header': fixedHeader}">
        <navbar />
        <tags-view v-if="showTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule, SettingsModule } from '@/plugins/store/modules'
import { AppMain, Navbar, Sidebar, TagsView, Settings } from './components'
import { RightPanel } from '@/components'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    Settings,
    RightPanel
  }
})
export default class extends mixins(ResizeMixin) {
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  get showSettings() {
    return SettingsModule.showSettings
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.header-container {
  position: fixed;
  z-index: $ZILv3;
  top: 0;
  left: 0;
  width: 100%;
  height: $headerHeight;
  background: $headerBg;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  // padding-top: $headerHeight;
  position: relative;
  background-color: $mainBg;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  // @include calcVHMinHeight($headerHeight);
}

.hideSidebar {
  .main-container {
    margin-left: $sideBarHideWidth;
  }

  .sidebar-container {
    width: $sideBarHideWidth !important;
  }

   .fixed-header {
    width: calc(100% - #{$sideBarHideWidth})
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
