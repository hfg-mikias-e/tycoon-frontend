<template>
  <div id="home">
    <div id="actions">
      <Button class="primary" @click="joinGame('party')" :buttonClass="'primary big'">
        create your own party
      </Button>
      <h4>OR</h4>
      <h3>... join a party by entering the ID here:</h3>
      <div>
        <h1>#</h1>
        <input v-model="partyID" placeholder="–––––––––" maxlength="9" />
        <Button class="secondary" :disabled="!partyExists || partyID.length < 9"
          @click="$router.push({ name: 'party', params: { roomID: partyID } })">Join</Button>
      </div>
      <p id="warning" :class="{ showWarning: !partyExists }">Sorry, unfortunately this Party does
        not seem to exist anymore.</p>
    </div>
    <div>
      <Button class="primary" @click="joinGame('random')" :buttonClass="'secondary big'">
        join a random game
      </Button>
      <h3>{{ clients?.length }} players are currently online.</h3>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Button from "@/components/Button.vue"

  export default defineComponent({
    name: "HomeView",
    components: {
      Button
    },

    data() {
      return {
        partyID: "",
        partyExists: true
      }
    },

    props: {
      clients: Object
    },

    watch: {
      partyID() {
        if (this.partyID.length === 9) {
          this.$socket.emit("checkForParty", this.partyID)
        } else {
          this.partyExists = true
        }
      }
    },

    sockets: {
      joinRoom(room: Array<string>) {
        const roomID = room[0]
        const roomType = room[1]
        this.$router.push({ name: roomType, params: { roomID } })
      },

      partyExists(exists: boolean) {
        this.partyExists = exists
      }
    },

    methods: {
      joinGame(roomType: string) {
        this.$socket.emit("findGame", roomType)
      }
    }
  })

  /*
  export default {
    setup() {
      const router = useRouter()
  
      socket.on("joinRoom", (room: Array<string>) => {
        const roomID = room[0]
        const roomType = room[1]
        router.push({ name: roomType, params: { roomID } })
      })
  
      function joinGame(roomType: string) {
        //socket.emit("findGame", roomType)
      }
  
      return {
        Button,
        joinGame
      }
    }
  }
  */
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
