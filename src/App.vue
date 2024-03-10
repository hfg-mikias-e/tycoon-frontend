<template>
  <p id="test">{{ clients }}</p>
  <TransitionGroup name="header" v-if="allowed">
    <Header key="header" v-if="showHeader"
      :username="clients.find(index => index.id === $store.state.userID)?.name" />
    <div key=router id="router">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :clients="clients" @showHeader="(show: boolean) => showHeader = show" />
        </Transition>
      </router-view>
    </div>
  </TransitionGroup>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Button from "@/components/Button.vue"
import Header from "@/components/Header.vue"
import { v4 as uuidv4 } from "uuid"

interface Client {
  id: string,
  name: string,
  socket: string
}

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
      clients: [] as Client[],
      showHeader: true
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

    updateUsers(clients: Array<Client>) {
      console.log("updateUsers")
      this.clients = clients
      this.allowed = true
    },

    redirectBack() {
      console.log("redirectBack")
      this.$router.push("/")
    },

    disconnect() {
      console.log("disconnected.")
      this.$router.push("/")
    }
  }
})

/*
export default {
  setup() {
    //socket.connect()

    const connected = ref(false)
    const allowed = ref(false)
    const clients = ref([])

    socket.on("connect", () => {
      console.log("ELFOSIHGSBOEIH")
    })

    return {
      Button,
      Header,
      connected,
      allowed,
      clients
    }
  }
}
*/
</script>

<style lang="scss">
  @use "variables" as v;
  @import "./style.scss";

  #test {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;

    #router {
      overflow: hidden;
      flex-grow: 1;

      >div:last-child {
        // router container
        padding: calc(0.75*v.$viewport-padding) v.$viewport-padding;
        height: 100%;
      }
    }
  }

  .header-move,
  /* apply transition to moving elements */
  .header-enter-active,
  .header-leave-active {
    transition: all 1s ease;
  }

  .header-enter-from,
  .header-leave-to {
    transform: translateY(calc(-1*(100% + v.$viewport-padding)));
  }

  /* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
  .header-leave-active {
    position: absolute;
    width: calc(100vw - 2*(v.$viewport-padding))
  }
</style>
