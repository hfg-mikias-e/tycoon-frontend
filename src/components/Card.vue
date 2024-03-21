<template>
  <Transition name="pop">
    <Button id="cardButton">
      <img :src="require('../assets/cards/' + value + '-' + sign + '.png')" />
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
  width: 200%;
  box-shadow: -2px 0 2px rgba(v.$background-color, 0.4);
  border-radius: 4%;
  overflow: hidden;
  background: rgb(75, 9, 9);

  &:hover {
    transform: translate(0, -5%);
    transition: 0.2s;
  }

  &:disabled {
    filter: brightness(40%)
  }

  img {
    height: 100%;
    //filter: invert(1);
    opacity: 0.75;
  }
}

.selected {
  transform: translateY(-15%);

  &:hover {
    transform: translateY(50%);
  }
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  20% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

.pop-enter-active {
  animation: pop 0.4s ease-out;
}
</style>