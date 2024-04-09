<template>
  <div id="header">
    <div id="logo" @click="$router.push('/')">
      <TransitionGroup name="fade" mode="out-in">
        <div v-if="homeScreen">
          <h4>Welcome to</h4>
        </div>
        <div v-else>
          <Button icon="circle-left">Back to Menu</Button>
        </div>
      </TransitionGroup>
      <h2 :class="{ transformFont: !homeScreen, glow: homeScreen }">TYCOON<span>LINE</span></h2>
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
    padding-top: calc(2*v.$viewport-padding-vertical);
    align-items: flex-end;
    z-index: 5;

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

    // TYCOONLINE
    h2 {
      font-size: 3.75em;
      letter-spacing: -2px;
      line-height: 0.75;
      text-shadow: 0 0 20px rgba(#FFD8D8, 0.4);
      transition: all 1s ease-in-out;
      white-space: nowrap;

      >span {
        font-size: 0.5em;
      }

      &.transformFont {
        transform: scale(0.75) translate(-15%, 0);
        text-shadow: unset;
      }
    }

    #logo {
      >div:not(:last-child) {
        position: absolute;
        bottom: 100%;
      }
    }

    #headerButtons {
      flex-direction: row;
      gap: 1.5em;
    }
  }
</style>