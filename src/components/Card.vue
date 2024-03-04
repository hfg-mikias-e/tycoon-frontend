<template>
  <transition name="pop" mode="out-in" appear>
    <Button class="cardButton" :disabled="cardDisabled">
      <img class="card" :src="require('../assets/cards/' + cardImage + '.png')" />
    </Button>
  </transition>
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
    cardValue: Number,
    cardSign: String,
    cardDisabled: Boolean
  },

  computed: {
    cardImage(): string {
      if (this.cardSign === undefined || this.cardValue === undefined) {
        return '0'
      }
      return this.cardValue + '-' + this.cardSign
    }
  }
})
</script>

<style scoped lang="scss">
@use 'variables' as v;

.card {
  background: v.$secondary-color;
  width: 100%;
  border-radius: 4%;
  box-shadow: -2px 0 2px rgba(v.$background-color, 0.4);
}

.cardButton {
  width: 200%;

  &:hover {
    transform: translate(0, -5%);
    transition: 0.2s;
  }

  &:disabled {
    filter: brightness(40%)
  }
}

.pop-enter-active {
  animation: pop 0.36s ease-out;
}
</style>