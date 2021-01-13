<template>
  <div id="role-list-container">
    <section class="__cyan_filter_wrap">
      <section class="__cyan_form_wrap">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="data.searchForm"
        >
          <el-form-item prop="roleName">
            <el-input
              v-model="data.searchForm.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>

          <SearchGroup
            :sent="getList"
            :enableInterceptor="false"
            :reset="_$resetFields"
          />
        </el-form>
      </section>
      <el-button
        type="primary"
        @click="
          data.dialogFlag = true;
          data.pageType = pageType.add;
        "
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
      :visible.sync="data.dialogFlag"
      :title="ISADD ? '添加角色' : '编辑角色'"
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
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="data.insertForm.roleName"
            placeholder="不超过20个字符，支持中文、英文、数字及特殊字符"
          />
        </el-form-item>
        <el-form-item label="权限列表">
          <el-tree
            ref="tree"
            :check-strictly="data.checkStrictly"
            :data="data.tree"
            :props="{
              children: 'sonNode',
              label: 'perName',
              disabled: 'ifEnableCheckBox'
            }"
            show-checkbox
            node-key="id"
            default-expand-all
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="__cyan_dialog_footer">
          <el-button @click="_$closed">
            取消
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
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MixinForm } from '@/mixins'
import { TableColumnType } from '@/components/Table/index.vue'
import { SuccessStatus, _isDev } from '@/configs/const'
import { Tree } from 'element-ui'
import {
  roleList,
  roleDel,
  roleDetails,
  roleEdit,
  roleAdd,
  resourceListGetAllEnable
} from '@/api'
@Component
export default class Role extends Mixins(MixinForm) {
  private data: any = {
    tableColumsConfig: [],
    tableList: [],
    searchForm: {
      roleName: null,
      pageNum: 1
    },
    insertForm: {
      id: null,
      roleName: '',
      perButtonIds: []
    },
    tree: [],
    dialogFlag: false,
    pageType: null,
    checkStrictly: false,
    insertFormRules: {
      roleName: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' },
        { max: 20, message: '长度最多 20 个字符', trigger: 'blur' }
      ]
    }
  };
  protected created() {
    this.init()
    this.getPermissionList()
    this.getList = this._$generateGetList(roleList)
  }

  protected init() {
    this.data.pageType = this._$pageType.add
    this.data.tableColumsConfig = [
      { minWidth: 'TableWFive', label: '角色名称', prop: 'roleName' },
      { type: TableColumnType.date, label: '创建时间', prop: 'createTime' },
      {
        type: TableColumnType.buttons,
        minWidth: 'TableWThree',
        buttons: [
          {
            text: '编辑',
            fn: (row) => {
              this.getRoleDetails(row.id)
            }
          },
          {
            text: '删除',
            fn: (row) => {
              if (row.ifBindAccount == 0) {
                this._$confirm({
                  title: '删除提示',
                  text: '确定要删除该角色吗？',
                  success: () => this.roleDel(row)
                })
              } else {
                this._$alert({
                  text: '该角色已有账号，不能被删除。',
                  title: '删除提示'
                })
              }
            }
          }
        ]
      }
    ]
  }

  protected getPermissionList(data = { menuStatus: 0 }) {
    this.$axios(resourceListGetAllEnable(data)).then((res) => {
      SuccessStatus.includes(res.code) && (this.data.tree = res.data)
    })
  }

  protected getRoleDetails(id: string) {
    this.data.insertForm.id = id
    this.data.pageType = this._$pageType.edit
    this.$axios(roleDetails(id)).then((res) => {
      if (SuccessStatus.includes(res.code)) {
        this.data.insertForm.roleName = res.data.roleName
        this.data.dialogFlag = true
        this.$nextTick(() => {
          (this.$refs.tree as Tree).setCheckedKeys(
            this.$utils.recursionGetTreeLeafIds(res.data.perList)
          )
        })
      }
    })
  }

  protected sent() {
    let requestConfig = this.ISADD ? roleAdd : roleEdit
    let perButtonIds = (this.$refs.tree as Tree).getCheckedKeys(true)
    this.data = {
      ...this.data,
      insertForm: {
        ...this.data.insertForm,
        perButtonIds
      }
    }
    return this.$axios(requestConfig(this.data.insertForm))
  }

  protected respond(res) {
    if (SuccessStatus.includes(res.code)) {
      this.getList()
      this._$resetForm()
      this.data.dialogFlag = false
    }
  }

  protected roleDel(row: any) {
    this.$axios(roleDel(row.id)).then((res) => {
      this.getList()
    })
  }

  protected setCheckedKeys(keys: Array<any> = []) {
    this.$refs.tree && (this.$refs.tree as Tree).setCheckedKeys(keys)
  }

  @Watch('data.dialogFlag')
  onDialogFlagChange(newVal: boolean) {
    if (newVal) {
      this.setCheckedKeys()
      this.$nextTick(() => {
        this._$clearValidate()
      })
      if (this.ISADD) {
        this.data.insertForm = {
          id: null,
          roleName: '',
          perButtonIds: []
        }
      } else {
        this.data.insertForm = {
          ...this.data.insertForm,
          perButtonIds: []
        }
      }
    }
  }
}
</script>
