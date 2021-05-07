<style scoped lang="less">
</style>

<template>
  <div class="ex-date-picker-container">
    <el-date-picker
      v-model="syncForm.preTimeArr"
      :type="attributesRes['type']"
      :picker-options="attributesRes['picker-options']"
      :value-format="attributesRes['value-format']"
      :range-separator="attributesRes['range-separator']"
      :start-placeholder="attributesRes['start-placeholder']"
      :end-placeholder="attributesRes['end-placeholder']"
    >
    </el-date-picker>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch, Prop } from 'vue-property-decorator'
/**
 * @version 1.0
 * @name EXDateRangePicker
 * @classdesc 基于 el-date-picker 二次封装, 用于 type range 时, 添加默认配置, 自动分配range数组到对应form键
 * @prop { object, required } form el-form 绑定的 model
 * @prop { object } bindKeys range数组分配到 form model 的键名
 * @prop { object } attributes 原组件props组合对象
 *
 * @author chan
 */
@Component
export default class EXDateRangePicker extends Vue {
  @PropSync('form', { required: true })
  private syncForm!: any

  @Prop({
    required: false,
    type: Array,
    default: () => ['startTime', 'endTime']
  })
  private readonly bindKeys!: Array<string>

  @Prop({
    required: false,
    type: Object
  })
  private readonly attributes!: any

  private attributesRes: any = {
    type: 'daterange',
    'picker-options': {
      disabledDate(time) {
        return time.getTime() > Date.now()
      }
    },
    'value-format': 'yyyy-MM-dd',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期'
  }

  private startBindKey: string

  private endBindKey: string

  protected created() {
    this.initProps()
  }

  protected beforeMount() {
    this.$set(this.syncForm, 'preTimeArr', ['', ''])
    this.$set(this.syncForm, this.startBindKey, null)
    this.$set(this.syncForm, this.endBindKey, null)
  }

  protected initProps() {
    this.attributesRes = { ...this.attributesRes, ...this.attributes }
  }

  @Watch('syncForm.preTimeArr', { deep: true })
  public onPreTimeArrChange(newVal: any) {
    if (!newVal || newVal.length == 0) {
      newVal = ['', '']
    }
    let [startDate, endDate] = newVal
    this.$set(this.syncForm, this.startBindKey, startDate || '')
    this.$set(this.syncForm, this.endBindKey, endDate || '')
  }

  @Watch('bindKeys', { deep: true, immediate: true })
  onBindKeysChange(newVal: Array<string>) {
    [this.startBindKey, this.endBindKey] = newVal
  }
}
</script>
