<style lang="scss">
.intergrated-data-container {
  .ig-d-top {
    display: flex;
    line-height: 30px;
    padding-bottom: 15px;
    .ig-d-title {
      font-size: $fontLv1;
      font-weight: bold;
      color: black;
      margin-right: 15px;
    }
    .ig-d-right {
      margin-left: auto;
    }
  }
}
</style>

<template>
  <div class="intergrated-data-container">
    <div class="ig-d-top">
      <h3 class="ig-d-title">
        {{ title }}
      </h3>
      <div class="ig-d-right">
        <slot name="right"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class IntegratedData extends Vue {
  @Prop({ required: false, type: String, default: '综合数据查询' })
  private readonly title: string;
}
</script>
