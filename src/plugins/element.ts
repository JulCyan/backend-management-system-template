
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  Dialog,
  Table,
  TableColumn,
  Tag,
  Select,
  Option,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Pagination,
  ColorPicker,
  Switch,
  Menu,
  MenuItem,
  Submenu,
  Form,
  FormItem,
  Input,
  Radio,
  RadioGroup,
  DatePicker,
  InputNumber,
  Tree,
  Scrollbar,
  Message
} from 'element-ui'
import { i18n } from '@/plugins'
export default {
  install(Vue: any) {
    Vue.prototype.$ELEMENT = {
      size: 'small',
      zIndex: 3000,
      i18n: (key: string, value: string) => i18n.t(key, value)
    }
    Vue.prototype.$message = Message;
    [
      Button,
      Breadcrumb,
      BreadcrumbItem,
      Badge,
      Dialog,
      Table,
      TableColumn,
      Tag,
      Select,
      Option,
      Dropdown,
      DropdownItem,
      DropdownMenu,
      Pagination,
      ColorPicker,
      Switch,
      Menu,
      MenuItem,
      Submenu,
      Form,
      FormItem,
      Input,
      Radio,
      RadioGroup,
      DatePicker,
      InputNumber,
      Tree,
      Scrollbar
    ].forEach(component => {
      Vue.use(component)
    })
  }
}
