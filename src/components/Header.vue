<template>
  <div id="header">
    <div id="logo" @click="$router.push('/')">
      <TransitionGroup name="fade" mode="out-in">
        <div v-if="homeScreen">
          <h3>Welcome to</h3>
        </div>
        <div v-else>
          <Button icon="circle-left">Back to Menu</Button>
        </div>
      </TransitionGroup>
      <h1 :class="{ transformFont: !homeScreen }">TYCOON<span>LINE</span></h1>
    </div>
    <div id="headerButtons">
      <Button class="secondary test" icon="fa-book-bookmark">Rules</Button>
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

<style lang="scss">
  @use 'variables' as v;

  #header {
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
    padding-bottom: 0;
    align-items: flex-end;
    z-index: 5;

    >div {
      height: fit-content;
    }

    // TYCOONLINE
    h1 {
      font-size: 3.75em;
      letter-spacing: -2px;
      line-height: 0.75;
      //text-shadow: 0 0 20px rgba(#FFD8D8, 0.4);
      transition: all 1s ease-in-out;
      white-space: nowrap;

      >span {
        font-size: 0.5em;
      }

      &.transformFont {
        transform: scale(0.75) translate(-15%, 0);
        cursor: pointer;
        //text-shadow: unset;
      }
    }

    #logo {
      >div:not(:last-child) {
        position: absolute;
        bottom: 100%;

        h3 {
          padding-bottom: 0.25em;
        }
      }
    }

    #headerButtons {
      flex-direction: row;
      gap: 1.25em;

      >button {
        padding: 0 1.25em;
        height: 2.5em;
      }
    }

    button {
      flex-direction: row-reverse;

      svg {
        height: 1em;
      }
    }
  }
</style>