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
  pointer-events: auto;
  box-sizing: border-box;
  font-family: "Lato", sans-serif;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  font-size: 1.125em;
  color: v.$text-color;
  font-weight: bold;
  border: none;
  margin: 0;
  background: none;
  text-decoration: none;
  vertical-align: middle;
  transition: 0.2s;
  align-items: center;
  gap: 0.75em;

  &:enabled:hover {
    cursor: pointer;
  }

  &:enabled:active {
    transform: translate(0, 0.175em);
    transition: 0.05s;
  }

  &.primary,
  &.secondary {
    padding: 0 1.5em;
    height: 3em;
    border-radius: 0.5em;
    border: 0.125em;

    &.big {
      height: 3.5em;
    }

    &:disabled {
      opacity: 0.2;
    }
  }

  &.primary {
    background-color: white;
    color: v.$background-color;

    &:enabled:hover {
      background: rgba(v.$primary-color, 0.8);
    }
  }

  &.secondary {
    color: white;
    border: 1px solid v.$text-color;
    background: inherit;

    &:enabled:hover {
      color: v.$primary-color;
      border: 1px solid rgba(v.$primary-color, 0.6);
    }
  }
}
</style>
