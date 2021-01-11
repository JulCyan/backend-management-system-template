// disabled and deprecated
type requireContextConfig = {
    path?: string
    deep?: boolean
    filterRegExp?: RegExp
    mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once',
    excludes?: Array<string>
}
export default (config?: requireContextConfig): Object => {
  const defaultConfig = { path: './', deep: true, filterRegExp: /\.ts$/, mode: undefined, excludes: [] }
  let { path, deep, filterRegExp, mode, excludes } = { ...defaultConfig, ...config }
  // TODO: 获取当前页面下所有文件路径
  let context = require.context(path, deep, filterRegExp, mode)
  // TODO: 获取文件路径
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
