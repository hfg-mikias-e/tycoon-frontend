<template>
  <div id="header">
    <div id="logo">
      <div :class="{ hideLogo: !homeScreen }">
        <h4>Welcome to</h4>
      </div>
      <div>
        <h2 :class="{ fixedFont: !homeScreen, glow: homeScreen }">TYCOON</h2>
        <h3 :class="{ fixedFont: !homeScreen, glow: homeScreen }">LINE</h3>
      </div>
    </div>
    <div id="headerButtons">
      <Button class="secondary" icon="fa-book-bookmark">Rules</Button>
      <Button class="secondary" icon="fa-user">{{ username }}</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from '@/components/Button.vue'

export default defineComponent({
  name: "Header",
  components: {
    Button
  },

  props: {
    username: String
  },

  computed: {
    homeScreen(): boolean {
      return this.$route.name === "home";
    }
  }
})
</script>

<style scoped lang="scss">
  @use 'variables' as v;

  #header {
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
    padding-bottom: 0;
    align-items: flex-end;

    >div {
      height: fit-content;
    }

    // TYCOON
    h2 {
      font-size: 3.25em;
      line-height: 0.8;
      letter-spacing: -4px;

      &.fixedFont {
        transform: scale(0.75) translate(-15%, 0);
        text-shadow: unset;
      }
    }

    // LINE
    h3 {
      font-size: 24px;
      letter-spacing: -2px;
      line-height: 0.8;

      &.fixedFont {
        transform: scale(0.75) translate(-155%, -15%);
        text-shadow: unset;
      }
    }

    h2,
    h3 {
      text-shadow: 0 0 20px rgba(#FFD8D8, 0.4);
    }

    #logo {
      flex-direction: column;
      justify-content: center;

      >div:first-child {
        height: 1.25em;

        &.hideLogo {
          opacity: 0;
          height: 0;
        }
      }

      >div:last-child {
        gap: 0.25em;
        flex-direction: row;
        align-items: flex-end;
      }

      * {
        transition: all 0.75s ease-in-out;
      }
    }

    #headerButtons {
      flex-direction: row;
      gap: 1.5em;
    }
  }
</style>