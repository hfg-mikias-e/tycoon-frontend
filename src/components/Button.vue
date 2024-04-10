<template>
  <button>
    <icon v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import { defineComponent } from "vue"

  export default defineComponent({
    name: "Button",
    props: {
      icon: String
    }
  })
</script>

<style scoped lang="scss">
  @use "variables" as v;

  button {
    font-size: 1.125em;
    transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.1s ease-out;

    &.primary,
    &.secondary {
      padding: 0.75em 1em;

      &:disabled {
        opacity: 0.2;
      }
    }

    &.primary {
      background-color: white;
      color: v.$background-color;

      &:enabled:hover {
        background: v.$secondary-color;
      }

      &:enabled:active {
        background: v.$primary-color;
      }
    }

    &.secondary {
      color: white;
      border: 2px solid v.$text-color;
      background: inherit;

      &:enabled:hover {
        color: v.$secondary-color;
        border-color: rgba(v.$secondary-color, 0.6);
      }

      &:enabled:active {
        color: v.$primary-color;
        border-color: rgba(v.$primary-color, 0.6);
      }
    }
  }
</style>
