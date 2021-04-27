<template>
  <div class="info-item-container">
    <div class="info-item-label">
      {{ label }}
    </div>

    <div
      class="info-item-value"
      v-html="value"
    >
    </div>
  </div>
</template>

<script lang="ts">
import { BaseNS } from '@/type'
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class InfoItem extends Vue {
  @Prop({ required: true, type: String })
  private readonly label: string;

  @Prop({ required: true })
  private readonly value: BaseNS;

  protected created() {}
}
</script>
