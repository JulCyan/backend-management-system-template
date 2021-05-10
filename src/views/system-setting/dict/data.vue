<style lang="scss">
#system-setting-dict-data-container {
  .__cyan_dialog {
    width: 455px;
    .__cyan_form_wrap {
      .el-form-item {
        &.w-half {
          width: 65%;
        }
      }
    }
  }
}
</style>

<template>
  <div id="system-setting-dict-data-container">
    <section class="__cyan_filter_wrap">
      <section class="__cyan_form_wrap">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="data.searchForm"
        >
          <el-form-item prop="字典名称">
            <EXSelect
              :form="data.searchForm"
              :attributesProp="{
                bind: 'diType',
                value: 'diType',
                label: 'diName',
                requestFn: dictList.bind(this,{pageSize: maxPageSize}),
                placeholder: '请输入字典名称',
                clearable: false
              }"
              :changeHandler="onDiTypeChange"
              :optionFilter="optionFilter"
            />
          </el-form-item>

          <el-form-item
            prop="diLabel"
          >
            <el-input
              v-model="data.searchForm.diLabel"
              placeholder="请输入字典标签"
            ></el-input>
          </el-form-item>

          <el-form-item prop="flag">
            <el-select
              v-model="data.searchForm.flag"
              clearable
              placeholder="请选择数据状态"
            >
              <el-option
                v-for="item in resourceStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <SearchGroup
              :sent="getList"
              :enableInterceptor="false"
              :reset="_$resetFields"
            />
          </el-form-item>
        </el-form>
      </section>
      <div class="__cyan_buttons_wrap">
        <el-button
          type="primary"
          @click="preAdd"
        >
          新增
        </el-button>
      </div>
    </section>
    <TableComplex
      ref="TableComplex"
      :tableColumsConfig="data.tableColumsConfig"
      :tableList="data.tableList"
      :params="data.searchForm"
      :getList="getList"
    />

    <!-- Dialog -->
    <el-dialog
      :title="ISADD ? '新增字典数据' : '编辑字典数据'"
      :visible.sync="data.dialogFlag"
      custom-class="__cyan_dialog"
      :close-on-click-modal="false"
      @closed="_$closed"
    >
      <el-form
        ref="insertForm"
        :model="data.insertForm"
        :rules="data.insertFormRules"
        class="__cyan_form_wrap"
        label-width="85px"
      >
        <el-form-item
          label="字典类型"
          prop="diType"
        >
          <el-input
            v-model="data.insertForm.diType"
            disabled
            placeholder="请输入字典名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="数据标签"
          prop="diLabel"
        >
          <el-input
            v-model="data.insertForm.diLabel"
            placeholder="请输入数据标签"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="数据键值"
          prop="diValue"
        >
          <el-input
            v-model="data.insertForm.diValue"
            placeholder="请输入数据键值"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="显示排序"
          prop="sort"
          class="w-half"
        >
          <el-input-number
            v-model="data.insertForm.sort"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="flag"
        >
          <el-radio-group v-model="data.insertForm.flag">
            <el-radio
              v-for="item in resourceStatusList"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="data.insertForm.remark"
            placeholder="请输入内容"
            autocomplete="off"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="__cyan_dialog_footer">
          <el-button @click="_$closed">
            取 消
          </el-button>
          <EXButton
            :attributesProp="{text: '确 定'}"
            :sent="sent"
            :respond="respond"
            :validator="_$validateForm"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { MixinForm } from '@/mixins'
import { TableColumnType } from '@/components/Table/index.vue'
import {
  roleGetAll,
  accountList,
  accountDel,
  accountResetPwd,
  accountAdd,
  accountEdit,
  employeeGetListByName,
  dictList,
  dictItemList, dictItemDel, dictItemAdd, dictItemEdit
} from '@/api'
import { MaxPageSize, ResourceStatus, resourceStatusList } from '@/configs/const'
@Component
export default class DictData extends Mixins(MixinForm) {
  private data: any = {
    tableColumsConfig: [],
    tableList: [],
    searchForm: {
      diType: '',
      diLabel: '',
      flag: null,
      pageNum: 1
    },
    insertForm: {},
    insertFormInit: {
      flag: ResourceStatus.enable,
      diType: '',
      diLabel: '',
      diValue: '',
      sort: 1,
      remark: ''
    },
    insertFormRules: {
      diLabel: [
        { required: true, message: '数据标签不能为空', trigger: 'change' },
        { max: 10, message: '长度最多为 10 个字符', trigger: 'change' }
      ],
      diValue: [
        { required: true, message: '数据键值不能为空', trigger: 'change' },
        { max: 10, message: '长度最多为 10 个字符', trigger: 'change' }
      ],
      sort: { required: true, trigger: 'blur', message: '排序值不能为空' },
      remark: [{ max: 200, message: '长度最多为 200 个字符', trigger: 'change' }]
    },
    dialogFlag: false,
    pageType: null
  };

  protected created() {
    this.init()
    this.getList = this._$generateGetList(dictItemList)
  }

  protected init() {
    this.onDiTypeChange(this.$route.query.diType)
    this._$resetForm()
    this.data.pageType = this._$pageType.add
    this.data.tableColumsConfig = [
      { minWidth: 'TableWThree', label: '字典标签', prop: 'diLabel' },
      { minWidth: 'TableWTwo', label: '字典排序', prop: 'sort' },
      { minWidth: 'TableWOne', label: '状态', prop: 'flagStr' },
      { minWidth: 'TableWFour', label: '备注', prop: 'remark' },
      { type: TableColumnType.date, label: '创建时间', prop: 'createTime' },
      {
        type: TableColumnType.buttons,
        minWidth: 'TableWThree',
        buttons: [
          {
            text: '编辑',
            fn: (row) => {
              this.data = {
                ...this.data,
                insertForm: { ...row },
                dialogFlag: true,
                pageType: this._$pageType.edit
              }
            }
          },
          {
            text: '删除',
            fn: (row) => {
              this._$confirm({
                title: '删除提示',
                text: '确定要删除该字典数据吗？',
                success: () => {
                  this.$axios(dictItemDel(row.id)).then((res) => {
                    this.getList()
                  })
                }
              })
            }
          }
        ]
      }
    ]
  }

  protected preAdd() {
    this.data = {
      ...this.data,
      dialogFlag: true,
      pageType: this._$pageType.add
    }
    this.$nextTick(() => {
      this.$nextTick(() => {
        this._$clearValidate()
      })
    })
  }

  protected sent() {
    const requestConfig = this.ISADD ? dictItemAdd : dictItemEdit
    return this.$axios(requestConfig(this.data.insertForm))
    // return Promise.resolve('success')
  }

  protected respond(res) {
    this.getList()
    this._$resetForm()
    this.data.dialogFlag = false
  }

  protected onDiTypeChange(val) {
    this.data.insertForm.diType = this.data.insertFormInit.diType = this.data.searchForm.diType = val
  }

  protected optionFilter<T>(options: Array<T>): Array<T> {
    return options.filter((item: any) => item.diType)
  }

  get dictList() {
    return dictList
  }

  get employeeGetListByName() {
    return employeeGetListByName
  }

  get resourceStatusList() {
    return resourceStatusList
  }

  get maxPageSize() {
    return MaxPageSize
  }
}
</script>
