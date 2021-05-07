<style scoped lang="less">
</style>

<template>
  <div class="__cyan_tree_container">
    <el-tree
      :data="data"
      :props="props"
      @node-click="nodeClickHandler"
    ></el-tree>
  </div>
</template>

<script lang="ts">
import { TreeProps } from 'node_modules/element-ui/types/tree'
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
@Component
export default class EXTree extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private readonly data!: Array<any>

  @Prop({
    required: false,
    type: Object
  })
  private readonly props!: TreeProps

  private propsRes = {
    children: 'children',
    label: 'label'
  }

  protected created() {
    this.init()
  }

  protected init() {
    this.propsRes = { ...this.propsRes, ...this.props }
  }

  @Emit('node-click')
  protected nodeClickHandler() {}
}
</script>
