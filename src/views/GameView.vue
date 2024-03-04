<template>
  <div id="game">
    <TransitionGroup name="fade" mode="out-in">
      <div v-if="!started">
        <div>
          <h1>Game <span class="accent-primary">#{{ roomID }}</span></h1>
          <p v-if="$route.name === 'party'">
            Invite your friends to this party over the following link:<br />
            <span class="note">
              Note that you can currently invite
              <span v-if="maxPlayers - players.length === 0">no</span>
              <span v-else>{{ maxPlayers - players.length }}</span>
              more player<span v-if="maxPlayers - players.length !== 1">s</span>.
            </span>
          </p>
          <p v-else>
            This is an open game which can be joined by anyone!<br />Note that
            this game needs 4 players before the it can be started.
          </p>
          <Button @click="$socket.emit('setReady', roomID, $store.state.userID)">I'm ready!</Button>
          <Button @click="startGame">TEST START</Button>
          <div v-if="showCounter">{{ counter }}</div>
        </div>
        <div id="lobbySlots">
          <div id="lobbyCard" :class="{ ready: player.ready }" v-for="(player, index) in players" :key="index">
            {{ player.id }}
            {{ player.ready }}
            {{ playerName(player.id) }}
          </div>
          <div id="lobbyCard" class="empty" v-for="index in (maxPlayers - players.length)" :key="index">waiting for
            another
            player ...</div>
        </div>
      </div>
      <Play :lobby="players.map(index => ({ id: index.id, name: playerName(index.id) }))" v-else />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from "@/components/Button.vue"
import Play from "@/components/Play.vue"

interface Player {
  id: string,
  ready: boolean
}

export default defineComponent({
  name: "GameView",
  components: {
    Button,
    Play
  },

  props: {
    roomID: String,
    clients: Object
  },

  data() {
    return {
      players: [] as Player[],
      maxPlayers: 4,

      counter: 3,
      showCounter: false,
      started: false
    }
  },

  methods: {
    startGame() {
      this.showCounter = true
      const count = setInterval(() => {
        if (this.counter > 0) {
          this.counter--
        } else {
          clearInterval(count)
          console.log("start!")
          this.started = true
        }
      }, 1000)
    },

    playerName(playerID: string) {
      console.log("TEST: " + playerID)
      return this.clients?.find((index: Player) => index.id === playerID).name
    }
  },

  sockets: {
    fetchRoom(data: Array<string>) {
      let newPlayers: Player[] = []
      data.forEach((playerID, i) => {
        const playerIndex = this.players.findIndex(index => index.id = playerID)
        newPlayers[i] = { id: data[i], ready: (playerIndex >= 0) ? this.players[playerIndex].ready : false }
      })
      this.players = newPlayers
    },

    changeReady(userID: string) {
      let playerIndex = this.players.findIndex(index => index.id === userID)
      this.players[playerIndex].ready = !this.players[playerIndex].ready
    }
  },

  mounted() {
    this.$socket.emit("moveRoom", this.roomID, "join")
    console.log(this.clients)
  },

  beforeUnmount() {
    this.$socket.emit("moveRoom", this.roomID, "leave")
  }
})

/*
export default defineComponent({
  props: {
    roomID: {
      type: String,
      required: true,
    },
    clients: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    const players = ref([] as Player[])
    const maxPlayers = 4

    const counter = ref(3)
    const showCounter = ref(false)
    const started = ref(false)

    function startGame() {
      showCounter.value = true
      const count = setInterval(() => {
        if (counter.value > 0) {
          counter.value--
        } else {
          clearInterval(count)
          console.log("start!")
          started.value = true
        }
      }, 1000)
    }

    function playerName(playerID: string) {
      return props.clients?.find((index: Player) => index.id === playerID).name
    }

    socket.on("fetchRoom", (data: Array<string>) => {
      let newPlayers: Player[] = []
      data.forEach((playerID, i) => {
        const playerIndex = players.value.findIndex(index => index.id = playerID)
        newPlayers[i] = { id: data[i], ready: (playerIndex >= 0) ? players.value[playerIndex].ready : false }
      })
      players.value = newPlayers
    })

    socket.on("changeReady", (userID: string) => {
      let playerIndex = players.value.findIndex(index => index.id === userID)
      players.value[playerIndex].ready = !players.value[playerIndex].ready
    })

    return {
      Button,
      Play,
      startGame,
      playerName,
      players,
      maxPlayers,
      //socket,
      store,
      started,
      showCounter,
      counter
    }
  }
})
*/
</script>

<style scoped lang="scss">
@use "variables" as v;

#game {
  >div {
    position: absolute;
    flex-direction: row;
    gap: v.$viewport-padding;
    border: 1px solid white;

    >div {
      width: fit-content;
      border: 1px solid red;
      flex-grow: 1;

      &:first-child {
        gap: 1em;
      }
    }

    #lobbySlots {
      display: grid;
      gap: calc(0.5*v.$viewport-padding);
      grid-template-columns: 1fr 1fr;
      height: fit-content;
      max-width: 60%;

      >div {
        background-color: rgba(v.$text-color, 0.2);
        background-size: cover;
        border-radius: 0.5em;
        overflow: hidden;
        aspect-ratio: 1/1;
      }
    }
  }
}
</style>
