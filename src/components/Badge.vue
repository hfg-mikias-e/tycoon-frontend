<template>
  <span class="badge">
    <icon v-if="icon !== undefined" :icon="icon" />
    <p>
      <slot></slot>
    </p>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: 'Badge',

  props: {
    icon: String
  }
})
</script>

<style scoped lang="scss">
@use 'variables' as v;

.badge {
  background-color: v.$text-color;
  color: v.$background-color;
  padding: 0 6px;
  border-radius: 20px;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-transform: uppercase;
  gap: 4px;

  &.status {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
  }
}
</style>