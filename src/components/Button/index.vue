<style scoped lang="scss">
.ex-button-container {
  display: inline-block;
}
</style>

<template>
  <div class="ex-button-container">
    <el-button
      :type="attributes.type"
      :size="attributes.size"
      :disabled="attributes.disabled"
      :plain="attributes.plain"
      :icon="attributes.icon"
      @click="execute"
    >
      {{ attributes.text }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
/**
 * @version 1.0
 * @name EXButton
 * @classdesc 基于 el-button 二次封装, 按钮click事件拦截: 请求, 节流, 表单校验
 * @prop { boolean } enableInterceptor 开启事件拦截
 * @prop { object } attributesProp 原按钮属性组合对象
 * @prop { Function } sent clickHandlerFunc
 * @prop { Function } respond clickResponseHandlerFunc
 * @prop { Function } validator 表单校验Func
 *
 * @author chan
 */
@Component
export default class EXButton extends Vue {
  @Prop({ type: Object })
  protected readonly attributesProp: any;

  @Prop({ type: Function, required: true })
  protected readonly sent: Function;

  @Prop({ type: Function, required: false })
  protected readonly respond: Function;

  @Prop({ type: Function, required: false })
  protected readonly validator: Function;

  @Prop({ type: Boolean, required: false, default: true })
  protected readonly enableInterceptor: boolean;

  protected autoUnfreezeTime: number = 10 * 1000;
  protected throttleTime: number = 0.3 * 1000;
  protected disabledFlag = false;
  protected attributes: any = {
    type: 'primary',
    size: 'small',
    disabled: false,
    plain: false,
    icon: '',
    formName: 'insertForm',
    text: '搜索'
  };

  protected created() {
    this.generateAttributes()
  }

  protected interceptor() {
    if (this.attributes.disabled) {
      return
    }
    this.attributes.disabled = true
    this.sent()
      .then((response) => {
        this.respond(response)
        setTimeout(() => {
          this.attributes.disabled = false
        }, this.throttleTime)
      })
      .catch((error) => {
        console.log(error)
        this.attributes.disabled = false
      })

    setTimeout(() => {
      if (this.attributes.disabled) {
        this.attributes.disabled = false
      }
    }, this.autoUnfreezeTime)
  }

  protected forward() {
    this.sent()
  }

  protected execute() {
    this.enableInterceptor
      ? this.validator
        ? this.validator(this.interceptor, this.attributes.formName)
        : this.interceptor()
      : this.forward()
  }

  protected generateAttributes() {
    this.attributes = { ...this.attributes, ...this.attributesProp }
  }
}
</script>
