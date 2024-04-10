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
    <div id="actions">
      <Button class="primary" @click="joinGame('party')" buttonClass="primary">
        create your own party
      </Button>
      <h4>OR</h4>
      <Button class="secondary" @click="joinByClipboard" buttonClass="secondary">
        <template v-if="clipboard !== ''">Join Party #{{ clipboard }}</template>
        <template v-else>Join someone's Party</template>
      </Button>
      <p>choose this option when you've copied the PartyID from a link your friends shared with you.</p>
    </div>
    <div>
      <Button class="primary" @click="joinGame('random')" buttonClass="secondary">
        join a random game
      </Button>
      <h3>{{ clients?.length }} players are currently online.</h3>
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

    /*
    watch: {
      partyID() {
        if (this.partyID.length === 9) {
          this.$socket.emit("checkForParty", this.partyID)
        } else {
          this.partyExists = true
        }
      }
    },
    */

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
    gap: calc(2*v.$viewport-padding-horizontal);
    height: fit-content;
    justify-content: space-between;
    flex-direction: row;

    >div {
      gap: calc(0.5*v.$viewport-padding-vertical);
      align-items: center;
      width: 100%;

      >button {
        width: 100%;
      }
    }
  }

  #buttons {
    flex-direction: row;
  }

  #actions {
    >div {
      flex-direction: row;
      gap: calc(0.5*v.$viewport-padding-vertical);
    }
  }

  #warning {
    max-height: 0;
    opacity: 0;
    transition: all 2s ease-in-out;

    &.showWarning {
      max-height: 100%;
      opacity: 1;
    }
  }

</style>
