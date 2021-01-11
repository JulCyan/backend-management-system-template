<style lang="scss">
#system-setting-account-container {
  .__cyan_dialog {
    width: 455px;
  }
}
</style>

<template>
  <div id="system-setting-account-container">
    <section class="__cyan_filter_wrap">
      <section class="__cyan_form_wrap">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="data.searchForm"
        >
          <el-form-item prop="roleId">
            <EXSelect
              :form="data.searchForm"
              :attributesProp="{bind: 'roleId',label: 'roleName', requestFn: roleGetAll}"
              :optionsProp="[{id: null, roleName: '所有账号角色'}]"
            />
          </el-form-item>

          <el-form-item prop="accountName">
            <el-input
              v-model="data.searchForm.accountName"
              placeholder="请输入账号名称或账号联系人姓名"
            ></el-input>
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
      <el-button
        type="primary"
        @click="insert"
      >
        新增
      </el-button>
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
      :title="ISADD ? '新增账号' : '编辑账号'"
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
        label-width="100px"
      >
        <el-form-item
          label="账号名称"
          prop="accountName"
        >
          <el-input
            v-model="data.insertForm.accountName"
            :disabled="!ISADD"
            placeholder="6-16个字符，支持英文、数字、下划线"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label=" 账号联系人"
          prop="empId"
        >
          <EXSelect
            :form="data.insertForm"
            :attributesProp="{bind: 'empId',label: 'name',filterable: true, requestFn: employeeGetListByName, clearable: false}"
          />
        </el-form-item>
        <el-form-item
          label=" 账号角色"
          prop="roleId"
        >
          <EXSelect
            :form="data.insertForm"
            :attributesProp="{bind: 'roleId',label: 'roleName', requestFn: roleGetAll, clearable: false}"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <p class="__cyan_tips">
            添加账号成功时会向该联系人手机号发送账号密码短信
          </p>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="__cyan_dialog_footer">
          <el-button @click="_$closed">
            取 消
          </el-button>
          <EXButton
            :attributesProp="{text: '确定'}"
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
  employeeGetListByName
} from '@/api'
@Component
export default class Account extends Mixins(MixinForm) {
  private data: any = {
    tableColumsConfig: [],
    tableList: [],
    searchForm: {
      roleId: null,
      accountName: '',
      pageNum: 1
    },
    insertForm: {
      accountName: '',
      empId: null,
      roleId: null
    },
    insertFormRules: {
      accountName: [
        { required: true, message: '账号名称不能为空', trigger: 'blur' },
        { max: 16, message: '长度最多 16 个字符', trigger: 'blur' },
        { min: 6, message: '长度最少 6 个字符', trigger: 'blur' }
      ],
      empId: [
        { required: true, message: '账号联系人不能为空', trigger: 'change' }
      ],
      roleId: [
        { required: true, message: '账号角色不能为空', trigger: 'change' }
      ]
    },
    dialogFlag: false,
    pageType: null
  };
  protected created() {
    this.init()
    this.getList = this._$generateGetList(accountList)
  }

  protected init() {
    this.data.pageType = this._$pageType.add
    this.data.tableColumsConfig = [
      { minWidth: 'TableWBase', label: '账号名称', prop: 'accountName' },
      { minWidth: 'TableWBase', label: '账号角色', prop: 'roleName' },
      { type: TableColumnType.date, label: '创建时间', prop: 'createTime' },
      { minWidth: 'TableWBase', label: '账号联系人', prop: 'employee.name' },
      {
        type: TableColumnType.buttons,
        minWidth: 'TableWThree',
        buttons: [
          {
            text: '密码重置',
            fn: (row) => {
              this._$confirm({
                title: '重置密码提示',
                text:
                  '重置后，新密码将发送至该账号联系人手机。确定要重置该账号的密码吗？',
                success: () => {
                  this.$axios(accountResetPwd(row.id)).then((res) => {
                    this.getList()
                  })
                }
              })
            }
          },
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
                text: '确定要删除该账号吗？',
                success: () => {
                  this.$axios(accountDel(row.id)).then((res) => {
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

  protected insert() {
    this.data = {
      ...this.data,
      insertForm: {
        accountName: '',
        empId: null,
        roleId: null
      },
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
    let requestConfig = this.ISADD ? accountAdd : accountEdit
    return this.$axios(requestConfig(this.data.insertForm))
    // return Promise.resolve('success')
  }

  protected respond(res) {
    this.getList()
    this._$resetForm()
    this.data.dialogFlag = false
  }

  get roleGetAll() {
    return roleGetAll
  }

  get employeeGetListByName() {
    return employeeGetListByName
  }
}
</script>
