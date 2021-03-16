<style scoped lang="scss">
.pagination-custom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .right {
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <div class="pagination-custom-container">
    <div class="left">
      当前 {{ paginationInfo.startRow }} 到 {{ paginationInfo.endRow }} 条, 共 {{ paginationInfo.total }} 条
    </div>
    <div class="right">
      <el-button
        type="primary"
        plain
        size="mini"
        :disabled="paginationInfo.isFirstPage"
        @click="homePage"
      >
        首页
      </el-button>
      <el-pagination
        :current-page.sync="syncParams.currentPage"
        :page-sizes="[5,10,20,50]"
        :page-size="syncParams.pageSize"
        prev-text="上一页"
        next-text="下一页"
        layout="prev, pager, next"
        :total="paginationInfo.total"
      >
      </el-pagination>
      <el-button
        type="primary"
        plain
        size="mini"
        :disabled="paginationInfo.isLastPage"
        @click="lastPage"
      >
        尾页
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  PropSync
} from 'vue-property-decorator'
import { Pagination, Button } from 'element-ui'
import { BaseNS } from '@/configs/type'
@Component({
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  }
})
export default class PaginationCustom extends Vue {
  @PropSync('params', {
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      pageNum: 1
    })
  })
  private syncParams!: any;

  @Prop({ default: () => [], type: Array })
  private readonly allList!: Array<any>;

  private list: Array<any> = [];

  private paginationInfo: any = {
    isFirstPage: true,
    isLastPage: true,
    hasNextPage: false,
    hasPreviousPage: false,
    lastPage: 1,
    startRow: 1,
    endRow: 1,
    total: 0
  };

  protected created() {
    this.getData()
  }

  protected homePage() {
    this.getData()
  }

  protected lastPage() {
    this.getData(this.paginationInfo.lastPage)
  }

  public indexMethod(index) {
    const limitpage = this.syncParams.pageSize || 10
    const curpage = this.syncParams.currentPage // 单前页码，具体看组件取值
    return index + 1 + (curpage - 1) * limitpage
  }

  protected structurePaginationInfo(
    length: number = this.allList.length
  ): void {
    const { currentPage, pageSize } = this.syncParams

    const lastPage = Math.ceil(length / pageSize)

    // 构造分页器信息
    this.paginationInfo.isFirstPage = currentPage === 1
    this.paginationInfo.isLastPage = currentPage === lastPage

    this.paginationInfo.hasNextPage = lastPage > currentPage
    this.paginationInfo.hasPreviousPage = currentPage > 1

    this.paginationInfo.lastPage = lastPage
    this.paginationInfo.startRow = (currentPage - 1) * 10 + 1
    this.paginationInfo.endRow = (currentPage - 1) * 10 + this.list.length
    this.paginationInfo.total = length
  }

  public getCurrentPage(): number {
    return this.syncParams.currentPage
  }

  public getData(currentPage = 1) {
    this.list = this.allList.slice((currentPage - 1) * 10, currentPage * 10)
    this.afterGetData(this.list)
  }

  @Emit()
  afterGetData(list: Array<any> = this.list) {
    return list
  }

  @Watch('allList', { immediate: true, deep: true })
  onAllListChange() {
    this.structurePaginationInfo()
    this.onCurrentPageChange(1)
  }

  @Watch('syncParams.currentPage', { immediate: true, deep: true })
  onCurrentPageChange(newVal: number) {
    this.getData(newVal as number)
    this.structurePaginationInfo()
  }
}
</script>
