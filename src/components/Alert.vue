<template>
    <div id="alert">
      <icon v-if="icon" :icon="icon" />
      <slot></slot>
      <icon id="close" icon="close" @click="$emit('closeAlert')"/>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"

  export default defineComponent({
    name: 'Alert',

    props: {
      icon: String
    },

    emits: ["closeAlert"],
  })
</script>

<style scoped lang="scss">
  @use 'variables' as v;

  #alert {
    z-index: 10;
    position: fixed;
    width: fit-content !important;
    top: v.$viewport-padding-vertical;
    flex-direction: row;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75em 1em;
    color: v.$text-color;
    background-color: v.$background-color;
    border-radius: 0.25em;
    gap: 0.5em !important;
    //white-space: nowrap;

    &.warning {
      background-color: v.$secondary-color;
    }

    &.error {
      background-color: v.$secondary-color;
    }

    svg#close {
      cursor: pointer;
    }
  }
</style>