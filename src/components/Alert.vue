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

    mounted() {
      setTimeout(() => {
        this.$emit('closeAlert')
      }, 5000)
    }
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
    color: v.$background-color;
    background-color: v.$text-color;
    border-radius: 0.25em;
    gap: 0.5em !important;
    //white-space: nowrap;

    &.success {
      background-color: v.$second-place-color;
    }

    &.warning {
      background-color: v.$first-place-color;
    }

    &.error {
      background-color: v.$primary-color;
    }

    svg#close {
      cursor: pointer;
    }
  }
</style>