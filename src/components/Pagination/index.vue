<style scoped lang="scss">
.base-pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    white-space: nowrap;
    font-size: 14px;
  }
  .right {
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <section class="__cyan_pagination_wrap">
    <div v-if="resInfo.total" class="base-pagination-container">
      <div class="left">
        当前第{{ resInfo.pageNum }}/{{
          Math.ceil(resInfo.total / resInfo.pageSize)
        }}页，每页{{ resInfo.pageSize }}条，共{{ resInfo.total }}条
      </div>
      <div class="right">
        <!-- <el-button
        type="primary"
        plain
        size="mini"
        :disabled="resInfo.isFirstPage"
        @click="homePage"
      >
        首页
      </el-button> -->
        <el-pagination
          :current-page.sync="syncParams.pageNum"
          :page-size="syncParams.pageSize || 10"
          layout="prev, pager, next, jumper"
          :total="resInfo.total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
        <!-- <el-button
        type="primary"
        plain
        size="mini"
        :disabled="resInfo.isLastPage"
        @click="lastPage"
      >
        尾页
      </el-button> -->
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import { BaseNS } from '@/configs/type'
import { ESNext } from '@/plugins/utils'
import { DataType } from '@/configs/const'
/**
 * @version 1.0
 * @name EXPagination
 * @classdesc 基于 el-pagination 二次封装, 扩展基础用法
 * @prop { object } params requestParams
 * @prop { Function } getList pageNumChangeHanderFunc
 * @prop { attributesForResetProp } executeAfterReset 执行reset后是否执行 searchClickHandlerFunc
 * @prop { object } tableSetting 组合 EXTable 组件所需参数
 * @prop { tableSetting } initGetList 初始化完成自动请求一次
 *
 * @author chan
 */
@Component
export default class EXPagination extends Vue {
  @PropSync('params')
  private syncParams!: any;

  @Prop({ required: true, type: Function })
  private readonly getList!: any;

  @Prop({
    required: false,
    type: Object,
    default: () => ({})
  })
  private readonly tableSetting!: any;

  private resInfo: any = {
    isFirstPage: true,
    isLastPage: true,
    hasNextPage: false,
    hasPreviousPage: false,
    lastPage: 1,
    startRow: 1,
    endRow: 1,
    total: 0
  };

  private queryParams: any = {};

  protected created() {
    if (this.$route.query.useQueryParams == '1') {
      const preQuery = this.$utils.copy(this.$route.query)
      delete preQuery.useQueryParams
      this.queryParams = preQuery
    }
  }

  protected mounted() {
    if (this.tableSetting.initGetList !== false) {
      this.getList()
    }
  }

  protected homePage() {
    this.getList()
  }

  protected lastPage() {
    this.getList(
      Math.ceil(this.resInfo.total / (this.syncParams.pageSize || 10))
    )
  }

  protected handleCurrentChange(val: BaseNS) {
    this.getList(val as number)
  }

  // public getList(currentPage: number = 1, pUrl: string = undefined) {
  //   let url = pUrl || this.url

  //   this.syncParams.pageNum = currentPage
  //   if (
  //     ESNext.typeOfAny(this.syncParams, DataType.array) &&
  //     this.syncParams.length === 0
  //   ) {
  //     return
  //   }

  //   this.$axios({
  //     method: 'post',
  //     url,
  //     data: {
  //       ...this.syncParams,
  //       ...this.queryParams
  //     }
  //   }).then(response => {
  //     this.resInfo = response.data
  //     this.afterGetData(
  //       this.$utils.catchNull(response, 'data.list', response.data || [])
  //     )
  //   })
  // }

  public refreshPagination() {
    this.queryParams = {}
    this.getList()
  }

  public refreshCurrentPage() {
    this.getList(this.syncParams.pageNum)
  }

  public indexMethod(index) {
    return (
      index +
      (this.syncParams.pageNum - 1) * (this.syncParams.pageSize || 10) +
      1
    )
  }

  public setResInfo(data: any) {
    this.resInfo = data
  }
}
</script>
