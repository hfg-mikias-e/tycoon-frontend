<template>
  <span class="badge">
    <icon v-if="icon" :icon="icon" />
    <slot></slot>
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
  width: fit-content;
  padding: 0.1em 0.5em;
  border-radius: 1em;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  gap: 0.25em;
}
</style>