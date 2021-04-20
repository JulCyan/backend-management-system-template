# 美住新Saas前端项目介绍

## 项目技术选型

- Vue 2.x
- Typescript
- VueRouter, Vuex, Axios, Element-ui,  Echarats etc.
- Vue Class Components 规范
- Vue Decorator, Vuex  Module Decorator 规范



## 安装

```
yarn install
```

###  开发编译和热加载

```
yarn serve
```

### 生产进行编译 

```
yarn build
```

### 代码规范检测插件
```
yarn lint
```

### 更多个性化设置
See [Configuration Reference](https://cli.vuejs.org/config/).


### 项目基本结构
```

|── dist/                                 # 打包结果
|── public/                               # 静态资源(打包后自动 copy 到 bundle 包)
|── src                                   # 源码
   |── api/                               # Ajax        
   |── assets                             # 静态资源(经过 webpack 处理)
   |── components/                        # 公共组件
   |── configs                            # 公共配置
      |── const/                          # 常量        
      |── interface.ts                    # 接口        
      └── type.ts                         # 自定义类型(union type)
   |── icons                              # svg图标
   |── layout                             # Layout
   |── mixins/                            # 公共逻辑封装基类
   |── plugins/                           # 外部插件
      |── axios.ts                        # axios 配置        
      └── router/                         # 路由
        |── index.ts                      # 路由基础配置        
        └── interceptor.ts                # 路由拦截配置
      |── store                           # 状态管理
   |── styles/                            # 样式
   |── views/                             # 页面
   |── App.vue                            # 入口组件
   |── main.ts                            # 入口文件
   └── settings.json                      # 默认设置
|── tests/                                # 测试脚本
|── types/                                # 声明文件
|── .env*                                 # 环境变量配置
|── .eslintrc.js                          # eslint 配置
|── babel.config.js                       # babel 配置
|── dts-service.js                        # .d.ts 文件生成脚本
|── gulpfile.js                       	  # gulp task 配置
|── package.json                          # package.json  
|── postcss.config.js                     # postcss 配置
|── tsconfig.json                         # typescript 配置
└── vue.config.js                         # webpack 配置

```



## 项目主体模块介绍

### 基础组件封装

#### EXbutton

src\components\Button\index.vue

```js
/**
 * @version 1.0
 * @name EXButton
 * @classdesc 基于 el-button 二次封装, 按钮click事件拦截: 请求, 节流, 表单校验
 * @property { boolean } enableInterceptor 开启事件拦截
 * @property { object } attributesProp 原按钮属性组合对象
 * @property { Function } sent clickHandlerFunc
 * @property { Function } respond clickResponseHandlerFunc
 * @property { Function } validator 表单校验Func
 * @author chan
 */
```

```vue
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
```

#### SearchGroup

src\components\Button\SearchGroup.vue

```js
/**
 * @version 1.0
 * @name SearchGroup
 * @extends EXButton
 * @classdesc 基于基础组件 Button 组合式组件, SearchResetGroup(可扩展)
 * @property { object } attributesForResetProp 同 EXbutton attributesProp
 * @property { Function } reset resetClickHandlerFunc
 * @property { attributesForResetProp } executeAfterReset 执行reset后是否执行 searchClickHandlerFunc
 *
 * @author chan
 */
```

```vue
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
@Component({
  components: {
    EXButton
  }
})
export default class SearchGroup extends EXButton {
  @Prop({ type: Object })
  protected readonly attributesForResetProp: any;

  @Prop({ type: Function, required: true })
  protected readonly reset: Function;

  protected attributesForReset: any = {
    type: 'primary',
    disabled: false,
    plain: false,
    icon: '',
    text: '重置',
    executeAfterReset: true
  };

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
```

#### TableComplex

