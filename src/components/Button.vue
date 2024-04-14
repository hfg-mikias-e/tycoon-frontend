<template>
  <button>
    <slot></slot>
    <icon v-if="icon" :icon="icon" />
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

    &.primary,
    &.secondary {
      padding: 0 1.5em;
      height: 3.25em;

      svg {
        height: 1.5em;
      }

      &:disabled {
        opacity: 0.25;
      }
    }

    &.primary {
      background-color: v.$text-color;
      color: v.$background-color;

      @media (hover: hover) {
        &:enabled:hover {
          background: rgba(v.$primary-color, 0.4);
        }
      }

      &:enabled:active {
        background: v.$primary-color;
      }
    }

    &.secondary {
      color: v.$text-color;
      border: 2px solid rgba(v.$text-color, 0.8);
      background: inherit;

      @media (hover: hover) {
        &:enabled:hover {
          color: rgba(v.$primary-color, 0.4);
          border-color: rgba(v.$primary-color, 0.25);
        }
      }

      &:enabled:active {
        color: v.$primary-color;
        border-color: rgba(v.$primary-color, 0.8);
      }
    }
  }
</style>
