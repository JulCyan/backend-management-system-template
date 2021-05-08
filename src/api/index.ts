{
  /* eslint-disable */
  let { requireContext } = require('@/plugins/utils/require-context')
  let list = requireContext(require.context('.', true, /\.ts$/))
  Object.keys(list).forEach((key) => {
    exports[key] = list[key]
  })
}