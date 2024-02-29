<template>
  <div class="header">
    <div class="logo">
      <div :style="{ 'height': welcome.height + 'px', 'opacity': welcome.opacity }">
        <h4>Welcome to</h4>
      </div>
      <div id="logo">
        <h2 :class="{ 'fixedFont': !homeScreen, 'glow': homeScreen }">TYCOON</h2>
        <h3 :class="{ 'fixedFont': !homeScreen, 'glow': homeScreen }">LINE</h3>
      </div>
    </div>
    <div class="buttons">
      <Button :buttonClass="'secondary'" :buttonIcon="'fa-book-bookmark'">Rules</Button>
      <Button :buttonClass="'secondary'" :buttonIcon="'fa-user'">{{ username }}</Button>
    </div>

    <!--
        <hr/>
        <div class="container info viewport" v-if="showDisclaimer">
            <icon icon="xmark" @click="closeDisclaimer()" class="close actionable"/>
            <h4>DISCLAIMER</h4>
            <br/>
            <p style="margin:6px;">I am in not affiliated with ATLUS Co., Ltd. This web application is meant to be a fan/hobby project and doesn't imitate the actual Persona 5/Persona 5 Royal games. Displayed images and assets on this site have the sole purpose of creating an aesthetically fitting theme and belong to its respective copyright/creator. If you encounter any issues, please contact me over this e-mail: <a href='mailto:tycoonline.game@gmail.com'>tycoonline.game@gmail.com</a></p>
            <hr/>
            <div style="display:flex;"><icon icon="fa-regular fa-square" class="checkbox actionable" v-show="!checkbox" @click="changeCheckbox()"/><icon icon="fa-square-check" class="checkbox active actionable" v-show="checkbox" @click="changeCheckbox()"/><p>Do not show again</p></div>
        </div>
        <hr/>
      -->
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
    homeScreen(): Boolean {
      return this.$route.name === "Home";
    },

    welcome() {
      if (this.homeScreen) {
        try {
          return { height: 20, opacity: 1 }
        } catch {
          return { height: 0, opacity: 1 }
        }
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

  @media (max-width: v.$viewport-medium-big) {
    padding: 0 40px;
  }

  @media (max-width: v.$viewport-small-medium) {
    height: 40px;
    padding: 0 24px;
  }

  @media (max-width: v.$viewport-mobile-small) {
    padding: 0 20px;
  }

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

  @media (max-width: v.$viewport-mobile-small) {
    font-size: 40px;
  }

  @media (min-width: v.$viewport-small-medium) {
    transform: scale(1.5) translate(16%, 14%);
  }

  @media (min-width: v.$viewport-medium-big) {
    transform: scale(1.8) translate(22%, 20%);
  }
}

// LINE
h3 {
  font-size: 24px;
  letter-spacing: -2px;
  line-height: 0.8;

  @media (max-width: v.$viewport-mobile-small) {
    font-size: 20px;
  }

  @media (min-width: v.$viewport-small-medium) {
    transform: scale(1.5) translate(166%, 52%);
  }

  @media (min-width: v.$viewport-medium-big) {
    transform: scale(1.6) translate(244%, 86%);
  }
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

  @media (max-width: v.$viewport-small-medium) {
    gap: 16px;
  }
}

.fixedFont {
  transform: scale(1) translate(0);
}

.glow {
  text-shadow: 0 0 20px rgba(#FFD8D8, 0.4);
}</style>