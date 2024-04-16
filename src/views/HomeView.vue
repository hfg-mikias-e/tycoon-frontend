<template>
  <div id="home">
    <Transition name="fade">
      <Alert v-if="!partyExists" class="error" @closeAlert="partyExists = true">Sorry, your clipboard does not contain
        a valid PartyID.</Alert>
    </Transition>
    <Transition name="fade">
      <Alert v-if="clipboardNotAllowed" class="warning" @closeAlert="clipboardNotAllowed = false">Your browser seems to
        be blocking your clipboard! Please try again by allowing this action when you press the button.</Alert>
    </Transition>
    <div>
      <div class="container">
        <div class="title">
          <h1 style="margin-right: -0.1em;">Play</h1>
          <h3>with your</h3>
          <h2>Friends!</h2>
        </div>
        <Button class="primary" @click="joinGame('party')" icon="hand-point-right">
          create your own party
        </Button>
        <h4>OR</h4>
        <Button class="secondary" @click="joinByClipboard" icon="handshake-angle">
          <template v-if="clipboard !== ''">Join Party #{{ clipboard }}</template>
          <template v-else>Join someone's Party</template>
        </Button>
        <p>Click this option when you've copied the link to a party your friends shared with you.</p>
      </div>
      <div class="container">
        <div class="title">
          <h1>{{ clients?.length - 1 ?? 0 }}</h1>
          <div>
            <h3>other</h3>
            <h2>Player<span v-if="clients?.length - 1 !== 1">s</span></h2>
          </div>
          <h3><span v-if="clients?.length - 1 === 1">is</span><span v-else>are</span> online.</h3>
        </div>
        <Button class="primary" @click="joinGame('random')" icon="dice">
          join a random game
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Button from "@/components/Button.vue"
  import Alert from '@/components/Alert.vue'

  export default defineComponent({
    name: "HomeView",
    components: {
      Button,
      Alert
    },

    data() {
      return {
        partyID: "",
        clipboard: "",
        partyExists: true,
        clipboardNotAllowed: false
      }
    },

    props: {
      clients: Object
    },

    sockets: {
      joinRoom(room: Array<string>) {
        const roomID = room[0]
        const roomType = room[1]
        this.$router.push({ name: roomType, params: { roomID } })
      },

      partyExists(partyID: string) {
        this.clipboard = partyID
        this.partyExists = partyID !== ""
      }
    },

    methods: {
      joinGame(roomType: string) {
        this.$socket.emit("findGame", roomType)
      },

      async joinByClipboard() {
        if (this.clipboard) {
          this.$router.push({ name: 'party', params: { roomID: this.clipboard } })
        } else {
          try {
            const clipboardString = await navigator.clipboard.readText()
            this.$socket.emit("checkForParty", clipboardString)
          } catch {
            this.clipboardNotAllowed = true
          }
        }
      }
    },
  })
</script>

<style scoped lang="scss">
  @use "variables" as v;

  #home {
    >div {
      flex-direction: row;
      justify-content: space-between;
      gap: v.$viewport-padding-horizontal;
      width: 100%;

      >div {
        flex-basis: 100%;
        align-items: center;

        &:first-child {
          @media (max-height: 400px) {
            border-radius: 0.75em 0.75em 0 0;
          }
        }

        >button {
          width: 100%;
        }

        p {
          text-align: center;
        }

        .title {
          flex-direction: row;
          position: absolute;
          padding-left: inherit;
          align-items: flex-end;
          gap: 0.2em;
          bottom: 100%;
          width: 100%;

          >div {
            gap: 0.25em;
          }
        }
      }
    }
  }

  #buttons {
    flex-direction: row;
  }
</style>
