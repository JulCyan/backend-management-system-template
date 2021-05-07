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
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { SettingsModule } from '@/plugins/store/modules'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  get title() {
    return SettingsModule.title
  }
}
</script>
