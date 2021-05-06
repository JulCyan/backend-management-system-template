// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const settings = require('./src/settings.json')
const NODE_ENV_ISDEV = process.env.NODE_ENV === 'development'
const NODE_ENV_ISPROD = process.env.NODE_ENV === 'production'
const config = {
  // publicPath: NODE_ENV_ISPROD ? '/vue-typescript-admin-template/' : '/',
  lintOnSave: NODE_ENV_ISDEV,
  productionSourceMap: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  devServer: {
    port: settings.devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // clientLogLevel: 'warn' ,
    progress: false,
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_PREFIX]: {
        target: `${process.env.VUE_APP_BASE_API}:${settings.remoteServerPort}/`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
      }
    }
  },
  pwa: {
    name: settings.title,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/plugins/pwa/index.ts')
    }
  },
  chainWebpack(config) {
    // provide the app's title in html-webpack-plugin's options list so that
    // it can be accessed in index.html to inject the correct title.
    // https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
    config
      .plugin('html')
      .tap(args => {
        args[0].title = settings.title
        return args
      })

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config
      .plugin('preload')
      .tap(() => [
        {
          rel: 'preload',
          // to ignore runtime.js
          // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: 'initial'
        }
      ])

    // when there are many pages, it will cause too many meaningless requests
    config
      .plugins
      .delete('prefetch')

    // https://webpack.js.org/configuration/devtool/#development
    // Change development env source map if you want.
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    // config
    //   .when(NODE_ENV_ISDEV,
    //     config => config.devtool('eval-cheap-source-map')
    //   )

    config
      .when(!NODE_ENV_ISDEV,
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 2, // 最低重复使用次数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )

    // 添加分析工具
    config
      .when(process.env.npm_config_report && NODE_ENV_ISPROD,
        config => {
          config.plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .end()
        })

    config.performance
      .when(NODE_ENV_ISPROD, config => {
        config
          .hints('warning')
          // 入口起点的最大体积
          .maxEntrypointSize(2 * 1024 * 1024)
          // 生成文件的最大体积
          .maxAssetSize(1024 * 1024)
      })
  }
}

const filterConfig = (config) => {
  if (!settings.enableProxy || !process.env.VUE_APP_BASE_API) {
    delete config.devServer.proxy
  }
  if (!settings.enablePWA) {
    delete config.devServer.pwa
  }
  return config
}

module.exports = filterConfig(config)
