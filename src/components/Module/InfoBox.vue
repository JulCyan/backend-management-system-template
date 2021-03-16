<style lang="scss">
.info-box-container {
  display: flex;
  width: 60%;
  flex-wrap: wrap;
}
.info-item-container {
    display: flex;
    min-width: 20%;
    margin-bottom: 15px;
    margin-right: 5%;
    .info-item-label {
      margin-right: 15px;
      color: #666666;
    }
    .info-item-value {
      color: #161818;
    }
  }
</style>

<template>
  <div class="info-box-container">
    <InfoItem
      v-for="(item, index) in config"
      :key="index"
      :label="item.label"
      :value="getValue(item)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { InfoItem } from '@/components'
import { TableColumnType } from '../Table/index.vue'
@Component({
  components: { InfoItem }
})
export default class InfoBox extends Vue {
  @Prop({ required: true, type: Object, default: () => ({}) })
  private readonly data;

  @Prop({ required: true, type: Array, default: () => [] })
  private readonly config: Array<{ label: string; prop?: string; computed: Function }>;

  protected getValue(item) {
    let result = null
    if (item.computed) {
      result = item.computed(this.data)
    } else if (item.type === TableColumnType.date) {
      result = this.$utils.formatDate(this.$utils.catchNull(this.data, item.prop, ''))
    } else if (item.type === TableColumnType.dateAbout) {
      result = this.$utils.formatDate(this.$utils.catchNull(this.data, item.prop, ''), 'YYYY-MM-DD')
    } else {
      result = this.$utils.catchNull(this.data, item.prop, '')
    }

    return result
  }
}
</script>
