// 1. 安装 "@babel/plugin-transform-runtime": "^7.12.10"
// 2. babel.config.js 配置  sourceType: 'unambiguous'
// 3. tsconfig.json  配置 "module": "commonjs"
// 4. 下面是替换统一出口文件 export * from 'xxx' 代码

// const { requireContext } = require('@/plugins/utils/require-context')
// let list = requireContext(require.context('.', true, /\.ts$/))
// Object.keys(list).forEach((key) => {
//   exports[key] = list[key]
// })

exports.requireContext = function(context, excludes:Array<string> = ['.d.ts']) {
  let list = {}
  // TODO: 过滤非必要加载文件
  context.keys().filter((item) => {
    return !excludes.filter(fd => item.includes(fd)).length
  }).forEach(item => {
    // TODO: 加载文件
    let me = context(item)
    let data = me.default || me
    Object.assign(list, data)
  })
  return list
}
