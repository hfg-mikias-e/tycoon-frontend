<template>
  <p>{{ connected }} {{ allowed }} {{ $store.state.userID }}</p>
  <Header v-if="allowed"/>
  <router-view v-slot="{ Component }">
    <Transition name="fade">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Button from "@/components/Button.vue"
import Header from "@/components/Header.vue"
import { v4 as uuidv4 } from "uuid"

export default defineComponent({
  name: "HomeView",
  components: {
    Button,
    Header,
  },

  data() {
    return {
      connected: false,
      allowed: false,
    }
  },

  sockets: {
    async connect() {
      this.connected = true

      if (!this.$store.state.userID) {
        await this.$store.dispatch("setID", uuidv4())
      }

      this.$socket.emit("connectUser", this.$store.state.userID)
    },

    allowUser() {
      this.allowed = true
    },

    redirectBack() {
      console.log("AAA")
      this.$router.push("/")
    },

    disconnect() {
      console.log("disconnected.")
    }
  },
})
</script>

<style lang="scss">
@use "variables" as v;
@import "./style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
