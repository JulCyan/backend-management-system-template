<template>
  <div>
    <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
      <slot />
    </a>
    <router-link v-else :to="to">
      <slot />
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RegHttpsLink } from '@/configs/const'

@Component({
  name: 'SidebarItemLink'
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string;

  protected isExternal(val): boolean {
    return this.$utils.regexpTest(RegHttpsLink, val)
  }
}
</script>
