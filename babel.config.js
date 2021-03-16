module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: '~src/assets/theme'
      }
    ]
  ],
  sourceType: 'unambiguous'
}
