import { IRequestFunc } from '@/configs/interface'
import { SuccessStatus } from '@/configs/const/index'
import { ElForm } from 'element-ui/types/form'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { TableComplex, EXButton, EXSelect, SearchGroup } from '@/components'
import MixinBase from './Base'
export type MessageBoxParams = { text: string, title: string, success?: Function, cancel?: Function, final?: Function }
@Component({
  components: { TableComplex, EXButton, EXSelect, SearchGroup }
})
export default class Form extends Mixins(MixinBase) {
  [x: string]: any

  public pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    }
  };

  public getList(currentPage: number = 1) { }

  public _$confirm({ text, title, success, cancel, final }: MessageBoxParams) {
    this.$confirm(text, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      success && success()
    }).catch(() => {
      cancel && cancel()
    }).finally(() => {
      final && final()
    })
  }

  public _$alert({ text, title, final }: MessageBoxParams) {
    this.$alert(text, title, {
      confirmButtonText: '确定',
      callback: action => {
        final && final()
      }
    })
  }

  public _$generateGetList(api: IRequestFunc) {
    return (currentPage: number = 1) => {
      this.data.searchForm.pageNum = currentPage
      this.$axios(api(this.data.searchForm)).then((res) => {
        if (SuccessStatus.includes(res.code)) {
          this.data.tableList = this.$utils.catchNull(
            res,
            'data.list',
            res.data || []
          )
          this.setTableResInfo(res.data)
        }
      })
    }
  }

  public setTableResInfo(resInfo) {
    try {
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      this.$refs.TableComplex.$refs.Pagination.setResInfo(resInfo)
    } catch (error) {
      console.log(error)
    }
  }

  public _$validateForm(func: Function, formName: string = 'insertForm') {
    (this.$refs[formName] as ElForm).validate(valid => {
      if (valid) {
        return func()
      } else {
        console.log('error submit!!')
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('error')
      }
    })
  }

  public _$clearValidate(props: Array<string> | string = undefined, formName: string = 'insertForm') {
    this.$nextTick(() => {
      let formRef: ElForm = this.$refs[formName] as ElForm
      formRef && (props ? formRef.clearValidate(props) : formRef.clearValidate())
    })
  }

  public _$validateField(props: Array<string> | string, { callback, formName }: any = { formName: 'insertForm' }) {
    !formName && (formName = 'insertForm')
    !callback && (callback = () => { });
    (this.$refs[formName] as ElForm).validateField(props, callback)
  }

  public _$resetFields(formName: string = 'searchForm') {
    (this.$refs[formName] as ElForm).resetFields()
  }

  public _$resetForm() {
    this.data.insertForm = { ...this.data.insertFormInit }
    this._$clearValidate()
  }

  public _$closed() {
    this.data.dialogFlag = false
    if (this.data.pageType === this._$pageType.edit) {
      this._$resetForm()
    } else {
      this._$clearValidate()
    }
  }

  public _$autoRegistryhookBeforeDestroy(fn) {
    let randomName = 'hook:beforeDestroy' + Math.random() * 100000
    window.addEventListener(randomName, fn, false)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener(randomName, fn, false)
    })
  }

  @Watch('data.searchForm.preTimeArr', { deep: true })
  public onSearchFormChange(newVal: any) {
    if (!newVal || newVal.length == 0) {
      newVal = [null, null]
    }
    [this.data.searchForm.startTime, this.data.searchForm.endTime] = newVal
  }
}
