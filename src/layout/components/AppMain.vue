<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view class="app-main-content-container" />
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AppMain'
})
export default class extends Vue {}
</script>

<style lang="scss">
.app-main {
  overflow: hidden;
  padding: $mainPadding 0 0 $mainPadding;
  .app-main-content-container {
    padding: 30px;
    min-height: 526px;
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
</style>
