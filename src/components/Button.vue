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

    &.primary,
    &.secondary {
      padding: 0.75em 1.25em;
      border: 0.125em;

      &:disabled {
        opacity: 0.2;
      }
    }

    &.primary {
      background-color: white;
      color: v.$background-color;

      &:enabled:hover {
        * {
          color: v.$primary-color;
        }

        background: rgba(v.$primary-color, 0.8);
      }
    }

    &.secondary {
      color: white;
      border: 1px solid v.$text-color;
      background: inherit;

      &:enabled:hover {
        * {
          color: v.$primary-color;
        }

        color: v.$primary-color;
        border: 1px solid rgba(v.$primary-color, 0.6);
      }
    }
  }
</style>
