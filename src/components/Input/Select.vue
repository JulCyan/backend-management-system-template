<template>
  <el-select
    v-model="syncForm[attributes.bind]"
    :filterable="attributes.filterable"
    :placeholder="attributes.placeholder"
    :clearable="attributes.clearable"
    class="base-select-container"
    @change="change"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item[attributes.label] ? item[attributes.label] : item"
      :value="item[attributes.value] ? item[attributes.value] : item"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator'
import { DataType, SuccessStatus } from '@/configs/const'
import { ESNext } from '@/plugins/utils'
@Component
export default class EXSelect extends Vue {
  @PropSync('form')
  private syncForm!: any;

  @Prop({ type: Object, required: true })
  private readonly attributesProp!: any;

  @Prop({ type: Array, required: false, default: () => [] })
  private readonly optionsProp!: Array<any>;

  @Prop({ type: Function, required: false })
  private readonly changeHandler!: Function;

  @Prop({ type: Function, required: false })
  private readonly optionFilter!: Function;

  private attributes: any = {
    label: 'value',
    value: 'id',
    filterable: false,
    clearable: true
  };

  private options: Array<any> = [];

  protected created() {
    this.generateAttributes()
    this.$axios(this.attributesProp.requestFn()).then((res) => {
      if (SuccessStatus.includes(res.code)) {
        let options = ESNext.typeOfAny(res.data, DataType.array) ? res.data : res.data.list
        options = this.optionsProp.concat(options)
        if (this.optionFilter) {
          options = this.optionFilter(options)
        }
        this.options = options
      }
    })
  }

  protected generateAttributes() {
    this.attributes = { ...this.attributes, ...this.attributesProp }
  }

  protected change(val: any) {
    this.changeHandler && this.changeHandler(val)
  }
}
</script>
