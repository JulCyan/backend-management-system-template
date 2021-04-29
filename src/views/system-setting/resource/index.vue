<style lang="scss">
#resource-container {
  .__cyan_dialog {
    width: 600px;
    .__cyan_form_wrap {
      .el-form-item {
        float: left;
      }
    }
  }
  .__custom_icon_select {
    .el-input__prefix {
      left: 10px;
    }
  }
}
.__custom_icon_list {
  width: 465px;
  .el-select-dropdown__list {
    display: flex;
    flex-wrap: wrap;
    .el-select-dropdown__item {
      display: flex;
      justify-content: unset;
      align-items: center;
      width: 33.3%;
      .text {
        margin-left: 5px;
      }
    }
  }
}
</style>
<template>
  <div id="resource-container">
    <section class="__cyan_filter_wrap">
      <section class="__cyan_form_wrap">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="data.searchForm"
        >
          <el-form-item prop="perName">
            <el-input
              v-model="data.searchForm.perName"
              placeholder="请输入资源名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="menuStatus">
            <el-select
              v-model="data.searchForm.menuStatus"
              clearable
              placeholder="请选择资源状态"
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
          <SearchGroup
            :sent="getList"
            :enableInterceptor="false"
            :reset="_$resetFields"
          />
        </el-form>
      </section>
      <el-button
        type="primary"
        @click="preAdd"
      >
        新增
      </el-button>
    </section>
    <section class="__cyan_table_wrap">
      <el-table
        :data="data.tableList"
        border
        stripe
        row-key="id"
        class="__cyan_table"
        row-class-name="__cyan_table_row"
        cell-class-name="__cyan_table_cell"
        header-row-class-name="__cyan_table_header_row"
        :tree-props="{children: 'sonNode', hasChildren: 'ifEnableCheckBox'}"
        :expand-row-keys="data.expandRowKeys"
        style="width: 100%"
        @expand-change="expandChange"
      >
        <el-table-column
          prop="perName"
          label="资源名称"
          align="left"
          :min-width="variables['TableWFour']"
        />
        <el-table-column
          prop="perOrder"
          label="排序"
          :min-width="variables['TableWBase']"
        />
        <el-table-column
          prop="perKey"
          label="权限标识"
          :min-width="variables['TableWFive']"
        />
        <el-table-column
          prop="component"
          label="组件路径"
          :min-width="variables['TableWFour']"
        />
        <el-table-column
          prop="meta"
          label="META"
          :min-width="variables['TableWFour']"
        />
        <el-table-column
          prop="menuStatusStr"
          label="状态"
          :min-width="variables['TableWBase']"
        />
        <el-table-column
          fixed="right"
          label="操作"
          :min-width="variables['TableWThree']"
        >
          <template #default="{row}">
            <el-button
              type="text"
              size="small"
              @click="preAdd(row)"
            >
              新增
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="preEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="resourceDel(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!-- Dialog -->
    <el-dialog
      :visible.sync="data.dialogFlag"
      :title="ISADD ? '添加资源' : '编辑资源'"
      custom-class="__cyan_dialog"
      :close-on-click-modal="false"
      @closed="_$closed"
    >
      <el-form
        ref="insertForm"
        :model="data.insertForm"
        :rules="data.insertFormRules"
        class="__cyan_form_wrap clearfix"
        label-width="85px"
      >
        <el-form-item
          label="上级资源"
          prop="parentId"
        >
          <treeselect
            v-model="data.insertForm.parentId"
            :options="data.allResourceList"
            :show-count="true"
            :normalizer="normalizer"
            noChildrenText="无子节点数据"
            noResultsText="无匹配数据"
            placeholder="请选择上级资源"
          />
        </el-form-item>
        <el-form-item
          label="资源类型"
          prop="perType"
        >
          <el-radio-group v-model="data.insertForm.perType">
            <el-radio
              v-for="item in resourceTypeList"
              :key="item.value"
              :disabled="radioDisabled(item.value)"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="图标"
          style="width: 100%"
          prop="icon"
        >
          <el-select
            v-model="data.insertForm.icon"
            class="__custom_icon_select"
            filterable
            clearable
            popper-class="__custom_icon_list"
            placeholder="请选择"
          >
            <template #prefix>
              <i :class="data.insertForm.icon"></i>
            </template>
            <el-option
              v-for="item in elementIconClassName"
              :key="item"
              :label="item"
              :value="item"
            >
              <i
                style="color: #8492a6; font-size: 13px"
                :class="item"
              ></i><span class="text">{{ item.split('el-icon-')[1] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="w-half"
          label="资源名称"
          prop="perName"
        >
          <el-input
            v-model="data.insertForm.perName"
            placeholder="请输入资源名称"
          />
        </el-form-item>
        <el-form-item
          class="w-half"
          label="显示排序"
          prop="perOrder"
        >
          <el-input-number
            v-model="data.insertForm.perOrder"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          v-if="ISDIR || ISMENU "
          class="w-half"
          label="路由地址"
          prop="routeAddr"
        >
          <el-input
            v-model="data.insertForm.routeAddr"
            placeholder="请输入路由地址"
          />
        </el-form-item>
        <el-form-item
          v-if="ISDIR || ISMENU"
          class="w-half"
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="data.insertForm.component"
            placeholder="请输入路由地址"
          />
        </el-form-item>
        <el-form-item
          v-if="ISBUTTON"
          class="w-half"
          label="URL"
          prop="perUrl"
        >
          <el-input
            v-model="data.insertForm.perUrl"
            placeholder="请输入请求 URL 路径"
          />
        </el-form-item>
        <el-form-item
          class="w-half"
          label="权限标识"
          prop="perKey"
        >
          <el-input
            v-model="data.insertForm.perKey"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item
          v-if="ISDIR || ISMENU "
          style="width: 100%"
          label="META"
          prop="meta"
        >
          <el-input
            v-model="data.insertForm.meta"
            type="textarea"
            :rows="3"
            placeholder="请输入 META 配置"
          />
        </el-form-item>
        <el-form-item
          v-if="ISMENU || ISDIR"
          class="w-half"
          label="资源状态"
          prop="menuStatus"
        >
          <el-radio-group v-model="data.insertForm.menuStatus">
            <el-radio
              v-for="item in resourceStatusList"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
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
import {
  resourceList,
  resourceAdd,
  resourceEdit,
  resourceDel,
  resourceDetails
} from '@/api'
import {
  SuccessBusinessStatus,
  _isDev,
  resourceStatusList,
  resourceTypeList,
  ResourceType,
  ResourceStatus,
  elementIconClassName,
  RegKeys
} from '@/configs/const'
import { Main, Tree } from 'element-ui'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { EXPagination } from '@/components'
import variables from '@/styles/_variables.scss'
import { Override } from '@/plugins/decorator'
import { asyncAddRoutes } from '@/plugins/router'
import { IFormValidate } from '@/type'
const MainType = '__$MainType'
@Component({
  components: {
    EXPagination,
    Treeselect
  }
})
export default class Resource extends Mixins(MixinForm) {
  constructor() {
    super()
    const metaValidator: IFormValidate = (
      rule: any,
      value: string,
      callback: any
    ) => {
      if (!value) {
        callback()
      }
      this.$nextTick(() => {
        if (typeof value == 'string') {
          try {
            const obj = JSON.parse(value)
            if (typeof obj == 'object' && obj) {
              callback()
            } else {
              callback(new Error('格式为 JSON'))
            }
          } catch (e) {
            callback(new Error('格式为 JSON'))
          }
        }
      })
    }

    this.data.insertFormRules = {
      perName: [
        {
          required: true,
          trigger: 'blur',
          message: '资源名称不能为空'
        },
        { max: 100, message: '长度最多 100 个字符', trigger: 'blur' }
      ],
      perOrder: {
        required: true,
        trigger: 'blur',
        message: '排序值不能为空'
      },
      routeAddr: {
        required: true,
        trigger: 'blur',
        message: '路由地址不能为空'
      },
      perUrl: {
        required: true,
        trigger: 'blur',
        message: 'URL不能为空'
      },
      perKey: [
        {
          required: true,
          trigger: 'blur',
          message: '权限标识不能为空'
        },
        { pattern: RegKeys, message: '格式应为 parentKey(:sonKey)*' },
        { max: 100, message: '长度最多 100 个字符', trigger: 'blur' }
      ],
      perType: {
        required: true,
        message: '资源类型不能为空'
      },
      meta: [{ validator: metaValidator, trigger: 'blur' }]
    }
  }

  private data: any = {
    tableColumsConfig: [],
    tableList: [],
    searchForm: {
      perName: null,
      menuStatus: null
    },
    insertForm: {},
    insertFormInit: {
      perType: null,
      menuStatus: ResourceStatus.enable,
      parentId: null,
      perName: '',
      perOrder: null,
      routeAddr: '',
      component: '',
      perUrl: '',
      perKey: '',
      meta: null
    },
    tree: [],
    dialogFlag: false,
    pageType: null,
    checkStrictly: false,
    insertFormRules: {},
    allResourceList: [],

    expandRowKeys: []
  };

  protected created() {
    this.init()
    this.getList()
  }

  protected init() {
    this._$resetForm()
  }

  public getList() {
    this.$axios(resourceList(this.data.searchForm)).then((res) => {
      if (SuccessBusinessStatus.includes(res.code)) {
        this.data.tableList = res.data
      }
    })
    this.getAllResourceList()
  }

  protected getAllResourceList() {
    this.$axios(resourceList({})).then((res) => {
      if (SuccessBusinessStatus.includes(res.code)) {
        this.data.allResourceList = [
          { perName: '主类目', id: MainType, sonNode: res.data }
        ]
        asyncAddRoutes(
          this.$utils.generateAsyncRoutes(
            this.$utils.routesMapper([res.data[1].sonNode[3]])
          )
        )
      }
    })
  }

  protected normalizer(node) {
    const result = {
      id: node.id,
      label: node.perName,
      children: node.sonNode
    }
    if (result.children == null || result.children == 'null') {
      delete result.children
    }
    return result
  }

  protected getResourceDetails(id: string) {
    this.$axios(resourceDetails(id)).then((res) => {
      if (SuccessBusinessStatus.includes(res.code)) {
        if (SuccessBusinessStatus.includes(res.code)) {
          if (this.data.pageType === this._$pageType.add) {
            this.data.insertForm.parentId = res.data.id
          } else {
            if (!res.data.parentId) {
              res.data.parentId = MainType
            }
            this.data.insertForm = res.data
          }
          this.data.dialogFlag = true
        }
      }
    })
  }

  protected preAdd(row) {
    this.data.pageType = this._$pageType.add
    if (row.id) {
      this.getResourceDetails(row.id)
    } else {
      this.data.dialogFlag = true
    }
  }

  protected preEdit(row) {
    this.data.insertForm.id = row.id
    this.data.pageType = this._$pageType.edit
    this.getResourceDetails(row.id)
  }

  protected paramsFilter() {
    const parentId = this.data.insertForm.parentId
    this.data.insertForm.parentId = parentId === MainType ? null : parentId
  }

  protected sent() {
    const requestConfig = this.ISADD ? resourceAdd : resourceEdit
    this.paramsFilter()
    return this.$axios(
      requestConfig({
        ...this.data.insertForm,
        meta: this.data.insertForm.meta
          ? JSON.parse(this.data.insertForm.meta)
          : null
      })
    )
  }

  protected respond(res) {
    if (SuccessBusinessStatus.includes(res.code)) {
      this.getList()
      this._$resetForm()
      this.data.dialogFlag = false
      if (!this.ISADD) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }
  }

  protected resourceDel(row: any) {
    this._$confirm({
      title: '删除提示',
      text: '确定要删除该资源吗？',
      success: () => {
        if (row.sonNode && row.sonNode.length) {
          this.$msg({
            title: '删除提示',
            message: '该资源存在子节点，不允许删除',
            type: 'error'
          })
        } else {
          this.$axios(resourceDel(row.id)).then((res) => {
            this.getList()
          })
        }
      }
    })
  }

  protected setCheckedKeys(keys: Array<any> = []) {
    this.$refs.tree && (this.$refs.tree as Tree).setCheckedKeys(keys)
  }

  protected radioDisabled(value) {
    const result = false
    return result
  }

  @Override
  getIndex(index) {
    return (this.$refs.Pagination as EXPagination).indexMethod(index)
  }

  @Override
  setTableResInfo(resInfo) {
    (this.$refs.Pagination as EXPagination).setResInfo(resInfo)
  }

  protected expandChange() {}

  @Watch('data.dialogFlag')
  protected onDialogFlagChange(newVal: boolean) {
    if (newVal) {
      this.setCheckedKeys()
      this.$nextTick(() => {
        this._$clearValidate()
      })
      if (this.ISADD) {
        // this.data.insertForm = {
        //   id: null,
        //   roleName: '',
        //   perButtonIds: []
        // }
      } else {
        // this.data.insertForm = {
        //   ...this.data.insertForm,
        //   perButtonIds: []
        // }
      }
    }
  }

  @Watch('data.insertForm.perType')
  protected onPerTypeChange(type: ResourceType) {
    switch (type) {
      case ResourceType.client:
        this.data.insertFormRules.routeAddr.required = this.data.insertFormRules.perUrl.required = false
        break
      case ResourceType.dir:
        this.data.insertFormRules.routeAddr.required = true
        this.data.insertFormRules.perUrl.required = false
        break
      case ResourceType.menu:
        this.data.insertFormRules.routeAddr.required = true
        this.data.insertFormRules.perUrl.required = false
        break
      case ResourceType.button:
        this.data.insertFormRules.routeAddr.required = false
        this.data.insertFormRules.perUrl.required = true
        break
      default:
        break
    }
    this.$nextTick(() => {
      this._$clearValidate()
    })
  }

  get resourceStatusList() {
    return resourceStatusList
  }

  get resourceTypeList() {
    return resourceTypeList
  }

  get ISCLIENT(): boolean {
    return this.data.insertForm.perType === ResourceType.client
  }

  get ISDIR(): boolean {
    return this.data.insertForm.perType === ResourceType.dir
  }

  get ISMENU(): boolean {
    return this.data.insertForm.perType === ResourceType.menu
  }

  get ISBUTTON(): boolean {
    return this.data.insertForm.perType === ResourceType.button
  }

  get variables() {
    return variables
  }

  get elementIconClassName() {
    return elementIconClassName.split(',')
  }
}
</script>
