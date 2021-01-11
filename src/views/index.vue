<style scoped  lang="scss">
.index-container {
  display: flex;
  background-color: #ffecf7;
  align-items: center;
  justify-content: center;
  .content {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>

<template>
  <div class="index-container">
    <div class="content">
      后台管理系统模板
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {}
</script>
