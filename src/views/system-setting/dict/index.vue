<style lang="scss">
#system-setting-dict-container {
  .__cyan_dialog {
    width: 455px;
  }
  .__cyan_filter_wrap {

  }
}
</style>

<template>
  <div id="system-setting-dict-container">
    <section class="__cyan_filter_wrap">
      <section class="__cyan_form_wrap">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="data.searchForm"
        >
          <el-form-item prop="diName">
            <el-input
              v-model="data.searchForm.diName"
              placeholder="请输入字典名称"
            ></el-input>
          </el-form-item>

          <el-form-item prop="diType">
            <el-input
              v-model="data.searchForm.diType"
              placeholder="请输入字典类型"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item prop="flag">
            <el-select
              v-model="data.searchForm.flag"
              clearable
              placeholder="请选择字典状态"
            >
              <el-option
                v-for="item in resourceStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item prop="preTimeArr">
            <el-date-picker
              v-model="data.searchForm.preTimeArr"
              type="daterange"
              :picker-options="pickerOptions"
              value-format="yyyy.MM.dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
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
      :title="ISADD ? '新增字典类型' : '编辑字典类型'"
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
          label="字典名称"
          prop="diName"
        >
          <el-input
            v-model="data.insertForm.diName"
            placeholder="请输入字典名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="字典类型"
          prop="diType"
        >
          <el-input
            v-model="data.insertForm.diType"
            :disabled="!ISADD"
            placeholder="请输入字典类型"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item
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
        </el-form-item> -->

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
  dictAdd,
  dictDel,
  dictDetails,
  dictEdit,
  dictList
} from '@/api'
import { ResourceStatus, resourceStatusList, SuccessStatus, _isDev } from '@/configs/const'
@Component
export default class Account extends Mixins(MixinForm) {
  private data: any = {
    tableColumsConfig: [],
    tableList: [],
    searchForm: {
      diName: '',
      diType: '',
      flag: null,
      startTime: null,
      endTime: null,
      preTimeArr: [],
      pageNum: 1
    },
    insertForm: {},
    insertFormInit: {
      flag: ResourceStatus.enable,
      diName: '',
      diType: null,
      remark: ''
    },
    insertFormRules: {
      diName: [
        { required: true, message: '字典名称不能为空', trigger: 'change' },
        { max: 30, message: '长度最多为 30 个字符', trigger: 'change' }
      ],
      diType: [
        { required: true, message: '字典类型不能为空', trigger: 'change' },
        { max: 40, message: '长度最多为 40 个字符', trigger: 'change' }
      ],
      remark: [
        { max: 200, message: '长度最多为 200 个字符', trigger: 'change' }
      ]
    },
    dialogFlag: false,
    pageType: null
  };
  protected created() {
    this.init()
    this.getList = this._$generateGetList(dictList)
  }

  protected init() {
    this._$resetForm()
    this.data.pageType = this._$pageType.add
    this.data.tableColumsConfig = [
      { minWidth: 'TableWThree', label: '字典名称', prop: 'diName' },
      {
        type: TableColumnType.buttons,
        label: '字典类型',
        prop: 'diType',
        minWidth: 'TableWThree',
        fixed: 'unset',
        buttons: [
          {
            fn: (row) => {
              this.$router.push({
                path: '/system-setting/dict/data',
                query: { diType: row.diType }
              })
            }
          }
        ]
      },
      { minWidth: 'TableWOne', label: '状态', prop: 'flagStr' },
      { minWidth: 'TableWThree', label: '备注', prop: 'remark' },
      { type: TableColumnType.date, label: '创建时间', prop: 'createTime' },
      {
        type: TableColumnType.buttons,
        minWidth: 'TableWThree',
        buttons: [
          {
            text: '编辑',
            fn: (row) => {
              this.getDictDetails(row)
            }
          },
          _isDev && {
            text: '删除',
            fn: (row) => {
              this._$confirm({
                title: '删除提示',
                text: '确定要删除该字典类型吗？',
                success: () => {
                  this.$axios(dictDel(row.id)).then((res) => {
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

  protected getDictDetails(row) {
    this.$axios(dictDetails(row.id)).then((res) => {
      if (SuccessStatus.includes(res.code)) {
        this.data = {
          ...this.data,
          insertForm: res.data || row,
          dialogFlag: true,
          pageType: this._$pageType.edit
        }
      }
    })
  }

  protected sent() {
    let requestConfig = this.ISADD ? dictAdd : dictEdit
    return this.$axios(requestConfig(this.data.insertForm))
    // return Promise.resolve('success')
  }

  protected respond(res) {
    this.getList()
    this._$resetForm()
    this.data.dialogFlag = false
  }

  get resourceStatusList() {
    return resourceStatusList
  }
}
</script>
