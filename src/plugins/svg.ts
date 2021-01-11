import SvgIcon from 'vue-svgicon'
import '@/icons/components'
export default {
  install(Vue: any) {
    Vue.use(SvgIcon, {
      tagName: 'svg-icon',
      defaultWidth: '1em',
      defaultHeight: '1em'
    })
  }
}
