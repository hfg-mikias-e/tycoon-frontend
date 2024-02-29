<template>
  <button>
    <icon v-if="buttonIcon" v-bind:icon="buttonIcon" />
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    buttonClass: String,
    buttonIcon: String,
    disabled: Boolean,
  }
});
</script>

<style lang="scss">
@use "variables" as v;

button {
  pointer-events: auto;
  box-sizing: border-box;
  font-family: "Lato", sans-serif;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  font-size: 18px;
  color: v.$text-color;
  font-weight: bold;
  border: none;
  margin: 0;
  background: none;
  text-decoration: none;
  vertical-align: middle;
  transition: 0.2s;
  align-items: center;
  gap: 12px;

  &:enabled:hover {
    cursor: pointer;
  }

  &:enabled:active {
    transform: translate(1px, 2px);
    transition: 0.05s;
  }

  &.primary,
  &.secondary {
    padding: 0 24px;
    height: 48px;
    border-radius: 12px;
    border: 1px;

    &.big {
      padding: 0 28px;
      height: 60px;
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
