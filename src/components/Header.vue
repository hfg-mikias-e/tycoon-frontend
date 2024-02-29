<template>
  <div class="header">
    <div class="logo">
      <div :style="{ height: welcome.height + 'px', opacity: welcome.opacity }">
        <h4>Welcome to</h4>
      </div>
      <div id="logo">
        <h2 :class="{ fixedFont: !homeScreen, glow: homeScreen }">TYCOON</h2>
        <h3 :class="{ fixedFont: !homeScreen, glow: homeScreen }">LINE</h3>
      </div>
    </div>
    <div class="buttons">
      <Button :buttonClass="'secondary'" :buttonIcon="'fa-book-bookmark'">Rules</Button>
      <Button :buttonClass="'secondary'" :buttonIcon="'fa-user'">{{ username }}</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from '@/components/Button.vue'

export default defineComponent({
  name: 'Header',
  components: {
    Button
  },

  props: {
    username: String
  },

  computed: {
    homeScreen(): boolean {
      return this.$route.name === "home";
    },

    welcome() {
      if (this.homeScreen) {
        return { height: 20, opacity: 1 }
      } else {
        return { height: 0, opacity: 0 }
      }
    }
  }
})
</script>

<style lang="scss">
@use 'variables' as v;

.header {
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 60px;
  height: 48px;

  >div {
    display: flex;
    flex-grow: 1;
  }
}

// TYCOON
h2 {
  font-size: 52px;
  line-height: 0.8;
  letter-spacing: -4px;
  z-index: 3;
}

// LINE
h3 {
  font-size: 24px;
  letter-spacing: -2px;
  line-height: 0.8;
}

.logo {
  flex-direction: column;
  justify-content: center;

  #logo {
    align-items: flex-end;
    gap: 2px;
  }

  * {
    display: flex;
    transition: all 0.75s ease-in-out;
    margin: 0;
    padding: 0;
  }
}

.buttons {
  justify-content: flex-end;
  gap: 20px;
}

.fixedFont {
  transform: scale(0.4) translate(0);
}

.glow {
  text-shadow: 0 0 20px rgba(#FFD8D8, 0.4);
}
</style>