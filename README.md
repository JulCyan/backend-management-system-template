# backend-management-system-template

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Project Structure
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


## Default Settings

 src/settings 修改部分 settings 时需要重启服务


## Project Use

### Main 

  - Vue Class Components With TypeScript

  - Element-UI

  - Vue-Router

  - Vuex-Class


### Package.json Scripts


#### DTS 声明文件自动生成服务

```
yarn dts-service
```

#### 并行开启 DTS 和 vue cli service

```
yarn concurrently-serve
```

#### 自定义 Element 主题生成

```
修改 src/styles/_variables.scss 

yarn et
```

#### SVG 组件生成脚本

```
添加或删除 src/icons/svg 

yarn svg
```

### Code Lint

  - ESlint

  - DTS-Service

### ENV Config

  - 对应环境变量配置 在 .env.staging 中

  - 本地配置 在 .env.staging.local 中

  - 未配置环境变量时, 默认使用 .env

  - .env < .env.staging < .env.staging.local
  
  - 不同环境开发及编译脚本详见 package.json 中 serve: 及 build:

#### API_URL

  - .env* 文件中, VUE_APP_API_URL=后端接口地址

### DTS-Service

- 监听 API 文件夹下 RequestFunc 变动自动生成对应的 .d.ts 文件 

- 可自定义配置目录及自定义 .d.ts 生成规则