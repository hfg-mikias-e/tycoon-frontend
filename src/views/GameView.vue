<template>
  <div id="game">
    <Transition name="fade" mode="out-in">
      <div id="lobby" v-if="!started">
        <div>
          <h1>Game <span class="accent-primary">#{{ roomID }}</span></h1>
          <div v-if="$route.name === 'party'">
            <p>Invite your friends to this party over the following link</p>
            <div id=" link">
              <p>Invite your friends to this party by sharing the following link:</p>
              <input readonly :value="link">
              <Button class="primary" icon="fa-regular fa-clipboard">Copy</Button>
            </div>
            <p class="note">Note that you can currently invite
              <span v-if="maxPlayers - players.length === 0">no</span>
              <b v-else>{{ maxPlayers - players.length }}</b>
              more player<span v-if="maxPlayers - players.length !== 1">s</span>.
            </p>
          </div>
          <p v-else>This is an open game which can be joined by anyone!<br />
            Note that this game needs 4 players before the it can be started.
          </p>

          <Transition name="fade">
            <div v-if="showCounter">
              <h1>The game starts in...</h1>
              <Counter :number="counter" />
            </div>
            <Button v-else class="primary" @click="$socket.emit('setReady', roomID, $store.state.userID)">I'm
              ready!</Button>
          </Transition>
        </div>

        <div id="lobbySlots">
          <div id="slot" :class="{ ready: player.ready }" v-for="(player, index) in players" :key="index">
            <Badge v-if="player.id === $store.state.userID">YOU</Badge>
            <p>{{ player.name }}</p>
            <Badge v-if="player.ready">READY!</Badge>
            <p v-else>not ready yet</p>
          </div>
          <div id="slot" class="empty" v-for="index in (maxPlayers - players.length) " :key="index">waiting for
            another
            player ...</div>
        </div>
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <Play v-show="started" :lobby="players" :roomID="roomID" :ready="started" />
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Button from "@/components/Button.vue"
import Badge from "@/components/Badge.vue"
import Counter from "@/components/Counter.vue"
import Play from "@/components/Play.vue"

interface Player {
  id: string,
  name: string,
  ready: boolean
}

export default defineComponent({
  name: "HomeView",
  components: {
    Button,
    Badge,
    Play,
    Counter
  },

  emits: ["showHeader"],

  props: {
    roomID: String,
    clients: Object
  },

  data() {
    return {
      players: [] as Player[],
      maxPlayers: 4,
      link: window.location.href,

      counter: 3,
      showCounter: false,
      started: false
    }
  },

  methods: {
    startGame() {
      this.$socket.emit("startGame", this.roomID)
      this.showCounter = true

      setTimeout(() => {
        const count = setInterval(() => {
          if (this.counter > 0) {
            this.counter--
          } else {
            clearInterval(count)
            this.started = true
            this.$emit("showHeader", false)
          }
        }, 1200)
      }, 500)
    },
  },

  sockets: {
    updateRoom(data: Array<string>) {
      let newPlayers: Player[] = []
      data.forEach((playerID, i) => {
        // compare to all ready states of the current players and overwrite the value if a player is still in the lobby
        const playerIndex = this.players.findIndex((index: Player) => index.id = playerID)
        newPlayers[i] = {
          id: data[i],
          name: this.clients?.find((index: Player) => index.id === data[i]).name,
          ready: (playerIndex >= 0) ? this.players[playerIndex].ready : false
        }
      })
      this.players = newPlayers
    },

    changeReady(userID: string) {
      let playerIndex = this.players.findIndex(index => index.id === userID)
      this.players[playerIndex].ready = !this.players[playerIndex].ready

      // start the game if the lobby is full and everyone is ready
      if (!this.players.some(index => !index.ready)/* && this.players.length === this.maxPlayers*/) {
        this.startGame()
      }
    }
  },

  mounted() {
    this.$socket.emit("moveRoom", this.roomID, "join")
  },

  beforeUnmount() {
    this.$socket.emit("moveRoom", this.roomID, "leave")
    this.$emit("showHeader", true)
  }
})
</script>

<style scoped lang="scss">
@use "variables" as v;

#game {
  #lobby {
    border: 1px solid pink;
    height: 100%;
    flex-direction: row;
    gap: v.$viewport-padding-horizontal;
    justify-content: space-between;

    >div {
      height: 100%;
      gap: calc(0.5*v.$viewport-padding-vertical);

      &:first-child {
        max-width: 25%;
      }
    }

    #link {
      border: 1px solid pink;
    }
  }

  #lobbySlots {
    border: 2px red solid;
    flex-direction: row;

    @media (min-height: 520px) {
      aspect-ratio: 1;
      max-width: 100%;
      max-height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #slot {
      border-radius: 0.75em;
      background-color: rgba(v.$text-color, 0.2);
      overflow: hidden;
      aspect-ratio: 1/1;
      width: 100%;
    }
  }
}
</style>
