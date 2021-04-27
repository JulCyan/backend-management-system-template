<style lang="scss">
.realtime-data-container {
  .rl-d-top {
    display: flex;
    align-items: center;
    line-height: 30px;
    padding-bottom: 15px;
    .rl-d-title {
      font-size: $fontTitle;
      font-weight: bold;
      color: black;
      margin-right: 15px;
    }
    .rl-d-tip {
      color: $text;
      font-size: $fontMin;
    }
    .rl-d-right {
      margin-left: auto;
    }
  }
}
</style>

<template>
  <div class="realtime-data-container">
    <div class="rl-d-top">
      <h3 class="rl-d-title">
        {{ title }}
      </h3>
      <div class="rl-d-tip">
        <slot name="tip">
          <span>{{ latestUpdateTime ? `${$utils.formatDate(latestUpdateTime)} 更新` : data.reportTime && `${data.reportTime} 更新` }} </span>
        </slot>
      </div>
      <div class="rl-d-right">
        <slot name="right"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { BaseNS } from '@/type'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class RealTimeData extends Vue {
  @Prop({ required: false, type: String, default: '实时数据展示' })
  private readonly title: string;

  @Prop({ required: false, type: Object, default: () => ({}) })
  private readonly data: any;

  get latestUpdateTime(): BaseNS {
    const { occurTime, latestUpdateTime, lastUpdateTime, toDayLastDate } = this.data
    return this.data && (occurTime || latestUpdateTime || lastUpdateTime || toDayLastDate)
  }
}
</script>
