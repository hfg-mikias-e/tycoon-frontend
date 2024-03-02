<template>
  <transition mode="out-in" name="short" appear>
    <div class="gameStatus" :class="{ permanent: permanent }">
      <icon id="statusIcon" :icon="eventIcon" />
      <h1>{{ event }}</h1>

      <p v-if="permanent">Card strength reversed.</p>

      <p v-else-if="event === 'all-pass'">Everyone passed.</p>
      <p v-else-if="event === 'eight-stop'">Starts a new stack instantly!</p>
      <p v-else-if="event === 'revolution'">Reverses all card values!</p>
      <p v-else-if="event === 'counter-revolution'">Negates the revolution!</p>
      <p v-else-if="event === '3-of-spades'">This card beats the Joker!</p>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Status',

  props: {
    event: String,
    permanent: Boolean
  },

  computed: {
    eventIcon(): any {
      if(this.permanent) {
        return "sync-alt"
      } else {
        switch (this.event) {
          case 'revolution':
            return "sync-alt"
          case 'counter-revolution':
            return "sync"
          case 'eight-stop':
            return "hand-paper"
          case '3-of-spades':
            return "font-awesome-flag"
          case 'all-pass':
            return "angles-right"
        }
      }
      //return "question"
    }
  }
});
</script>

<style lang="scss">
@use 'variables' as v;

.gameStatus {
  background-color: transparent;
  box-shadow: 0 0 16px rgba(v.$lighter-white, 0.25);
  padding: 32px 24px 32px 32px;
  position: absolute;
  right: 0;
  border-radius: 60px 0 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .permanent {
    left: 0;
    border-radius: 0 60px 60px 0;
    padding: 32px 32px 32px 24px;
  }

  h1 {
    text-transform: uppercase;
    font-weight: 600;
  }
  p {
    font-weight: 300;
  }
}

#statusIcon {
  position: absolute;
  top: 0;
  height: 40px;
  transform: translate(0, -50%)
}

.short-enter-active, .permanent-enter-active,
.short-leave-active, .permanent-leave-active {
  transition-property: all;
  transition-duration: .2s;
}

.short-enter-from, .short-leave-active {
    opacity: 0;
    transform: translate(100%);
}
.permanent-enter-from, .permanent-leave-active {
    opacity: 0;
    transform: translate(-100%);
}
</style>