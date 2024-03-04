<template>
  <div id="test">
    {{ clients }}
    {{ $store.state.userID }}
  </div>
  <Header v-if="allowed" :username="clients?.find(index => index.id === $store.state.userID).name" />
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :clients="clients" />
    </Transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid"
import Header from "@/components/Header.vue"

interface Client {
  id: string,
  socket: string,
  name: string
}

export default defineComponent({
  name: "App",
  components: {
    Header
  },

  data() {
    return {
      connected: false,
      allowed: false,

      clients: [] as Client[]
    }
  },

  sockets: {
    async connect() {
      this.connected = true
      console.log("connected.")

      if (!this.$store.state.userID) {
        await this.$store.dispatch("setID", uuidv4())
      }

      this.$socket.emit("connectUser", this.$store.state.userID)
    },

    allowUser() {
      this.allowed = true
    },

    updateUsers(clients: Array<Client>) {
      console.log(clients)
      this.clients = clients
    },

    redirectBack() {
      console.log("redirectBack")
      this.$router.push("/")
    },

    disconnect() {
      this.connected = false;
      console.log("disconnected.")
    }
  },

  /*
    setup() {
      const router = useRouter()
      const store = useStore()
  
      const connected = ref(false)
      const allowed = ref(false)
      const clients = ref([] as Client[])
  
      socket.on("connect", async () => {
        connected.value = true;
        console.log("connected.")
  
        if (!store.state.userID) {
          await store.dispatch("setID", uuidv4())
        }
  
        socket.emit("connectUser", store.state.userID)
      });
  
      socket.on("allowUser", () => {
        allowed.value = true
      });
  
      socket.on("updateUsers", (allUsers) => {
        clients.value = allUsers
      });
  
      socket.on("redirectBack", () => {
        console.log("redirectBack")
        router.push("/")
      });
  
      socket.on("disconnect", () => {
        connected.value = false;
        console.log("disconnected.")
      });
  
      return {
        Header,
        clients,
        allowed,
        store
      }
    }
  */
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
