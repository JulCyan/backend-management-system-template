<style scoped lang="scss">
.search-group-container {
  display: inline-block;
  .g-reset {
    margin-left: 20px;
  }
}
</style>

<template>
  <div class="search-group-container">
    <EXButton
      class="g-submit"
      :sent="sent"
      :respond="respond"
      :enableInterceptor="false"
      :attributesProp="attributesProp"
      :validator="validator"
    />
    <el-button
      class="g-reset"
      :type="attributesForReset.type"
      :size="attributes.size"
      :disabled="attributesForReset.disabled"
      :plain="attributesForReset.plain"
      :icon="attributesForReset.icon"
      @click="resetInterceptor"
    >
      {{ attributesForReset.text }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { EXButton } from '@/components'
/**
 * @version 1.0
 * @name SearchGroup
 * @extends EXButton
 * @classdesc 基于基础组件 Button 组合式组件, SearchResetGroup(可扩展)
 * @prop { object } attributesForResetProp 同 EXbutton attributesProp
 * @prop { Function } reset resetClickHandlerFunc
 * @prop { attributesForResetProp } executeAfterReset 执行reset后是否执行 searchClickHandlerFunc
 *
 * @author chan
 */
@Component({
  components: {
    EXButton
  }
})
export default class SearchGroup extends EXButton {
  @Prop({ type: Object })
  protected readonly attributesForResetProp: any

  @Prop({ type: Function, required: true })
  protected readonly reset: Function

  protected attributesForReset: any = {
    type: 'primary',
    disabled: false,
    plain: false,
    icon: '',
    text: '重置',
    executeAfterReset: true
  }

  protected resetInterceptor() {
    this.reset()
    if (this.attributesForReset.executeAfterReset) {
      this.$nextTick(() => {
        this.execute()
      })
    }
  }

  protected created() {
    this.generateAttributesForReset()
  }

  protected generateAttributesForReset() {
    this.attributesForReset = { ...this.attributesForReset, ...this.attributesForResetProp }
  }
}
</script>
