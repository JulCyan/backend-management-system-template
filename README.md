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
   |── views/                             # 页面
   |── App.vue                            # 入口组件
   |── main.ts                            # 入口文件
   └── vm-property.d.ts                   # Vue 实例声明
|── .env*                                 # 环境变量配置
|── .eslintrc.js                          # eslint 配置
|── babel.config.js                       # babel 配置
|── package.json                          # package.json  
|── postcss.config.js                     # postcss 配置
|── tsconfig.json                         # typescript 配置
└── vue.config.js                         # webpack 配置

``` 


## Project Use

### Main 

  - Vue Class Components With TypeScript

  - Element-UI

  - Vue-Router

  - Vuex-Class

### Custom Code 

  - ESlint

### ENV Config

  - 对应环境变量配置 在 .env.staging 中

  - 本地配置 在 .env.staging.local 中

  - 未配置环境变量时, 默认使用 .env

  - .env < .env.staging < .env.staging.local

#### API_URL
    
  - .env* 文件中, VUE_APP_API_URL=后端接口地址