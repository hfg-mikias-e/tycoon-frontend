<template>
  <div>
    <p v-if="!connected">The server is still waking up.</p>
    <template v-if="connected">
      <p id="test"></p>
      <Transition name="fade">
        <Alert v-if="notAvailable" class="error" @closeAlert="notAvailable = false">Sorry, this game does not exist
          anymore.
        </Alert>
      </Transition>
      <Transition name="fade">
        <div id="blocker" v-if="viewportOrientation.includes('portrait')">
          <p>Please rotate your device into landscape mode.</p>
          <div id="phone">
            <icon icon="mobile-screen" />
            <icon id="rotate" icon="rotate-left" />
          </div>
        </div>
      </Transition>
      <Transition name="header" v-if="allowed">
        <Header v-if="showHeader" :username="clients.find(index => index.id === $store.state.userID)?.name" />
      </Transition>
      <div id="router" v-if="allowed">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :clients="clients" @showHeader="(show: boolean) => showHeader = show" />
          </Transition>
        </router-view>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import Button from "@/components/Button.vue"
  import Header from "@/components/Header.vue"
  import Alert from "@/components/Alert.vue"
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
      Alert
    },

    data() {
      return {
        connected: false,
        allowed: false,
        clients: [] as Client[],
        notAvailable: false,
        showHeader: true,
        viewportOrientation: ""
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

      disconnect() {
        this.$router.go(0)
      },

      updateUsers(clients: Array<Client>) {
        this.clients = clients
        this.allowed = true
      },

      redirectBack() {
        this.$router.push("/")
        this.notAvailable = true
      }
    },

    created() {
      this.viewportOrientation = screen.orientation.type
      window.addEventListener("orientationchange", () => {
        this.viewportOrientation = screen.orientation.type
      });
    },

    beforeUnmount() {
      window.removeEventListener("orientationchange", () => {
        this.viewportOrientation = screen.orientation.type
      })
    },
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
    position: absolute;
  }

  #blocker {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba(v.$background-color, 0.9);
    z-index: 10;
    justify-content: center;
    align-items: center;
    gap: calc(0.5*v.$viewport-padding-vertical);
    color: v.$text-color;
    padding: 25%;

    p {
      text-align: center;
    }


    #phone {
      max-height: 4em;
      height: 80vw;
      align-items: center;
      gap: calc(0.5*v.$viewport-padding-vertical);

      svg {
        &:first-child {
          max-height: 4em;
          height: 80vw;
          animation: phone-rotate 3s infinite;
        }
      }

      @keyframes phone-rotate {
        20% {
          margin: 0;
          transform: rotate(0deg);
        }

        50%,
        90% {
          margin-bottom: -0.75em;
          transform: rotate(-90deg);
        }

        100% {
          transform: rotate(-360deg);
        }
      }
    }
  }

  #app {
    >div {
      height: 100%;
    }

    #router {
      overflow: hidden;
      flex-grow: 1;

      >div:last-child {
        // router container
        padding: v.$viewport-padding-vertical calc(2*v.$viewport-padding-horizontal);
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
    transform: translateY(calc(-1*(100% + v.$viewport-padding-vertical)));
  }

  /* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
  .header-leave-active {
    position: absolute;
    width: calc(100vw - 2*(v.$viewport-padding-horizontal))
  }
</style>
