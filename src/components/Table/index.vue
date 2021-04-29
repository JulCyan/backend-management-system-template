<style scoped lang="scss">
</style>

<template>
  <section class="__cyan_table_wrap">
    <el-table
      :data="tableList"
      border
      class="__cyan_table"
      row-class-name="__cyan_table_row"
      cell-class-name="__cyan_table_cell"
      header-row-class-name="__cyan_table_header_row"
      style="width: 100%"
      :max-height="tableSetting.maxHeight"
      @selection-change="selectionHandler"
    >
      <el-table-column
        v-if="tableSetting.selectionHandler"
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        v-if="isInstead"
        label="序号"
        type="index"
        fixed
        :index="getIndex"
        :width="variables['TableWBase']"
      />
      <el-table-column
        v-for="(tableColum, index) in tableColumsConfig"
        :key="index"
        :label="getLable(tableColum)"
        show-overflow-tooltip
        :fixed="getFixed(tableColum)"
        :min-width="getMinWidth(tableColum)"
      >
        <template #default="{row}">
          <div v-if="tableColum.type === tableColumnType.buttons">
            <el-button
              v-for="(button, i) in tableColum.buttons"
              :key="i"
              type="text"
              size="small"
              @click="button.fn(row)"
            >
              {{ button.text || $utils.catchNull(row, tableColum.prop) }}
            </el-button>
          </div>
          <div v-else-if="tableColum.type === tableColumnType.date">
            {{ $utils.formatDate($utils.catchNull(row, tableColum.prop)) }}
          </div>
          <div v-else-if="tableColum.type === tableColumnType.dateAbout">
            {{
              $utils.formatDate(
                $utils.catchNull(row, tableColum.prop),
                "YYYY-MM-DD"
              )
            }}
          </div>
          <div v-else>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              v-html="
                tableColum.prop !== undefined
                  ? $utils.catchNull(row, tableColum.prop)
                  : tableColum.computed(row)
              "
            ></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { EXPagination } from '..'
import TableComplex from './TableComplex.vue'
export type TableColumn = {
  minWidth: string;
  label: string;
  prop: string;
  type?: string;
};

export type ColumnButton = {
  text: string;
  fn: Function;
  type?: string;
};

export type TableColumnButtons = {
  type: string;
  minWidth: string;
  buttons: Array<ColumnButton>;
};

export enum TableColumnType {
  buttons = 'buttons',
  date = 'date',
  dateAbout = 'dateAbout',
  index = 'index',
  selection = 'selection',
}
/**
 * @version 1.0
 * @name EXTable
 * @classdesc 基于 el-table 二次封装, 实现数据驱动的配置化 Table
 * @prop { Array<TableColumn | TableColumnButtons> } tableColumsConfig 表格列配置信息
 * @prop { Object } tableSetting 表格控制项设置
 * @prop { Array<T> } tableList 表格数据
 *
 * @author chan
 */
/**
 * @version 1.0
 * @name tableColumsConfig
 * @description tableColumsConfig 字段介绍
 * @field { TableColumnType }  TableColumn.type 列类型
 * @field { string }  TableColumn.label 列名称
 * @field { string }  TableColumn.prop 列字段名
 * @field { string }  TableColumn.minWidth 列最小宽度
 * @field { TableColumnType } TableColumnButtons.type
 * @field { string } TableColumnButtons.minWidth
 * @field { Array<ColumnButton> } TableColumnButtons.buttons
 * @field { string } ColumnButton.type 按钮类型(颜色配置, 都是 text类型, todo)
 * @field { string } ColumnButton.text 按钮文本
 * @field { Function } ColumnButton.fn 按钮处理函数, 入参为 row
 */
@Component
export default class EXTable extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private readonly tableColumsConfig!: Array<TableColumn | TableColumnButtons>;

  @Prop({
    required: false,
    type: Object,
    default: () => ({})
  })
  private readonly tableSetting!: any;

  @Prop({
    required: true,
    type: Array
  })
  private tableList!: Array<any>;

  get variables() {
    return {
      TableWBase: '50px',
      TableWDate: '160px',
      TableWFive: '200px',
      TableWFour: '150px',
      TableWOne: '80px',
      TableWSeven: '300px',
      TableWSix: '250px',
      TableWThree: '120px',
      TableWTwo: '100px'
    }
  }

  get tableColumnType() {
    return TableColumnType
  }

  protected getMinWidth(tableColum) {
    let result = ''
    if (tableColum.type === TableColumnType.date) {
      result = this.variables.TableWDate
    } else if (tableColum.type === TableColumnType.dateAbout) {
      result = this.variables.TableWTwo
    } else {
      result = this.variables[tableColum.minWidth]
    }
    return result
  }

  protected getFixed(tableColum) {
    let result: string | true = ''
    if (tableColum.type === TableColumnType.buttons) {
      result = tableColum.fixed !== 'unset' ? 'right' : undefined
    } else if (tableColum.type === TableColumnType.index) {
      result = true
    } else {
      result = tableColum.fixed
    }
    return result
  }

  public getLable(row: TableColumn | TableColumnButtons): string {
    let result
    if ((row as TableColumn).label) {
      result = (row as TableColumn).label
    } else if ((row as TableColumnButtons).type === TableColumnType.buttons) {
      result = '操作'
    } else if (Object.prototype.hasOwnProperty.call(row, 'type')) {
      result = '序号'
    }
    return result
  }

  public getIndex(index) {
    const getIndex = (this.$parent as TableComplex).getIndex
    return getIndex ? getIndex(index) : index + 1
  }

  protected created() {}

  protected selectionHandler() {
    return this.tableSetting.selectionHandler || (() => {})
  }

  get isInstead(): boolean {
    return !this.tableColumsConfig.find(
      (item) => item.type === this.tableColumnType.index
    )
  }
}
</script>
