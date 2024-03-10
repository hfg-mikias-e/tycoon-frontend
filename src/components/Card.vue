<template>
  <Transition>
    <Button id="cardButton">
      <img v-if="sign && value" :src="require('../assets/cards/' + value + '-' + sign + '.png')" />
      <img v-else :src="require('../assets/cards/0.png')" />
    </Button>
  </Transition>
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
  box-shadow: -2px 0 2px rgba(v.$background-color, 0.4);
  border-radius: 4%;
  overflow: hidden;

  &:hover {
    transform: translate(0, -5%);
    transition: 0.2s;
  }

  &:disabled {
    filter: brightness(40%)
  }

  img {
    height: 100%;
    background: v.$secondary-color;
  }
}
</style>