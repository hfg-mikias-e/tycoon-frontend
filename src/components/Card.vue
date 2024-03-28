<template>
  <Button id="cardButton">
    <img :src="require('../assets/cards/' + value + '-' + sign + '.png')" draggable="false" />
  </Button>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Button from "@/components/Button.vue";

  export default defineComponent({
    name: 'Card',

    components: {
      Button
    },

    props: {
      value: Number,
      sign: String,
    }
  })
</script>

<style scoped lang="scss">
  @use 'variables' as v;

  #cardButton {
    width: 200%;
    box-shadow: -2px 0 2px rgba(v.$background-color, 0.4);
    border-radius: 4%;
    overflow: hidden;
    background: rgb(75, 9, 9);

    &:hover:not(.selected) {
      transform: translateY(-0.25em);
      transition: 0.2s;
    }

    &:disabled {
      filter: brightness(40%)
    }

    img {
      height: 100%;
      //filter: invert(1);
      opacity: 0.75;
      pointer-events: "none";
    }
  }

  .selected {
    transform: translateY(-0.75em);

    &:hover {
      transform: translateY(-1em);
    }
  }
</style>