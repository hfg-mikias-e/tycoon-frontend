<template>
  <div id="test">
    {{ clients }}
  </div>

  <Header v-if="allowed" />
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :clients="clients" />
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

      userID: "",
      clients: [] as object[]
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

    updateUsers(clients: Array<object>) {
      this.clients = clients
      console.log(this.clients[0])
    },

    redirectBack() {
      console.log("redirectBack")
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

#test {
  position: fixed;
  bottom: 0;
  left: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: v.$viewport-padding;

  >div:last-child {
    height: 100%;
  }
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
