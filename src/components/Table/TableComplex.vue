<style scoped lang="scss">
.table-complex-container {
  .__cyan_pagination_wrap {
    padding-top: 20px;
  }
}
</style>

<template>
  <div class="table-complex-container">
    <EXTable
      ref="Table"
      :tableColumsConfig="tableColumsConfig"
      :tableSetting="tableSetting"
      :tableList="tableList"
    />
    <EXPagination
      ref="Pagination"
      :params="params"
      :tableSetting="tableSetting"
      :getList="getList"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { EXTable, EXPagination } from '@/components'
import { TableColumn, TableColumnButtons } from '@/components/Table/index.vue'
@Component({
  components: {
    EXTable,
    EXPagination
  }
})
export default class TableComplex extends Vue {
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

  @Prop({ default: () => ({}) })
  private readonly params!: any;

  @Prop({ required: true, type: Function })
  private readonly getList!: Function;

  public getIndex(index) {
    return (this.$refs.Pagination as EXPagination).indexMethod(index)
  }
}
</script>
