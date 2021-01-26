<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view
          :key="key"
          class="app-main-content-container"
        />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { TagsViewModule } from '@/plugins/store/modules'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AppMain'
})
export default class AppMain extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }
}
</script>

<style lang="scss">
.app-main {
  @include calcVHMinHeight($headerHeight);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: $mainVerticalPadding $mainHorizontalPadding;
  .app-main-content-container {
    padding: 30px;
    @include calcVHMinHeight($headerHeight + $mainVerticalPadding * 2);
    background-color: #fff;
    &.include-real-intergrate-container {
      padding: 0;
      .el-tabs__header {
        margin-bottom: 0px;
      }
      .el-tabs__nav-wrap {
        &::after {
          height: 0;
        }
      }

      .tabs {
        padding: 15px $tabsContainerPadding 0;
        .el-tabs__item {
          height: 32px;
          line-height: 32px;
        }
      }

      .realtime-data-container {
        padding: 15px $tabsContainerPadding 0;
        .__cyan_table_wrap {
          min-height: unset;
          padding-bottom: 30px;
        }
      }

      .cut-off-rule {
        height: 10px;
        background-color: $mainBg;
      }

      .intergrated-data-container {
        padding: 15px $tabsContainerPadding;
      }
    }
  }
}

.fixed-header + .app-main {
  padding-top: $headerHeight + $mainVerticalPadding;
  height: 100vh;
  overflow: auto;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    @include calcVHMinHeight(
      $headerHeight + $mainVerticalPadding + $mainTagsViewHeight
    );
    .app-main-content-container {
      @include calcVHMinHeight(
        $headerHeight + $mainVerticalPadding * 2 + $mainTagsViewHeight
      );
    }
  }

  .fixed-header + .app-main {
    padding-top: $headerHeight + $mainVerticalPadding + $mainTagsViewHeight;
  }
}
</style>
