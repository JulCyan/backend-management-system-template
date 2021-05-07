<style scoped lang="less">
</style>

<template>
  <el-form-item prop="preTimeArr">
    <EXDateRangePicker
      :form.sync="syncForm"
      :bindKeys="bindKeys"
      :attributes="attributes"
    />
  </el-form-item>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { EXDateRangePicker } from '@/components'
@Component({
  components: {
    EXDateRangePicker
  }
})
export default class FormItemEXDateRangePicker extends EXDateRangePicker {}
</script>
