<template>
  <div id="game">
    <template v-if="entry">
      <Transition name="fade" mode="out-in">
        <div id="lobby" v-if="!started">
          <div>
            <h1>Game <span class="accent-primary">#{{ roomID }}</span></h1>
            <div v-if="$route.name === 'party'">
              <p>Invite your friends to this party over the following link:</p>
              <div id="link">
                <input readonly :value="link.pathname">
                <Button class="secondary" :icon="copied ? 'check' : 'fa-regular fa-clipboard'"
                  @click="copyToClipboard">Copy</Button>
              </div>
              <p class="note">Note that you can currently invite
                <span v-if="maxPlayers - players.length === 0">no</span>
                <b v-else>{{ maxPlayers - players.length }}</b>
                more player<span v-if="maxPlayers - players.length !== 1">s</span>.
              </p>
            </div>
            <div v-else>
              <p>This is an open game which can be joined by anyone!</p>
              <p class="note">Note that this game needs 4 players before the it can be started.</p>
            </div>

            <TransitionGroup name="fade">
              <div v-if="showCounter">
                <h1>The game starts in...</h1>
                <Counter :number="counter" />
              </div>
              <Button v-else class="primary"
                @click="$socket.emit('setReady', roomID, $store.state.userID, !players.find((player: Player) => player.id === $store.state.userID)?.ready)">I'm
                ready!</Button>
            </TransitionGroup>
          </div>

          <div>
            <div id="lobbySlots">
              <div id="slot" :class="{ ready: player.ready }" v-for="(player, index) in players" :key="index">
                <Badge v-if="player.id === $store.state.userID">YOU</Badge>
                <p>{{ player.name }}</p>
                <Badge v-if="player.ready">READY!</Badge>
                <p v-else>not ready yet</p>
                <div id="spacer"></div>
              </div>
              <div id="slot" class="empty" v-for="index in (maxPlayers - players.length) " :key="index">waiting ...
                <div id="spacer"></div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <Play v-show="started" :lobby="players" :roomID="roomID" :ready="started" @closeGame="resetGame" />
      </Transition>
    </template>
    <div v-else>
      <p>Sorry, this game is either full or has already started. Please try a different game.</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import Button from "@/components/Button.vue"
  //import Badge from "@/components/Badge.vue"
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
      //Badge,
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
        link: window.location,
        copied: false,

        counter: 3,
        showCounter: false,
        started: false,
        entry: false
      }
    },

    methods: {
      startGame() {
        // if the game is not a custom party it requires 4 players to start, otherwise at least 2
        if ((this.$route.name === 'party' && this.players.length > 1) || (this.$route.name === 'random' && this.players.length === this.maxPlayers)) {
          this.$socket.emit("startGame", this.roomID, true)
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
        }
      },

      async resetGame() {
        console.log("this is not supposed to fire.")

        // set all ready states back to the default
        await this.players.forEach((player: Player) => {
          this.$socket.emit("setReady", this.roomID, player.id, false)
        })

        // reset all to default value
        this.started = false
        this.showCounter = false
        this.counter = 3
        this.$emit("showHeader", true)

        this.$socket.emit('startGame', this.roomID, false)
      },

      copyToClipboard() {
        navigator.clipboard.writeText(this.link.href).then(() => {
          this.copied = true
        });
      }
    },

    sockets: {
      updateRoom(data: Array<Player>) {
        console.log("updateRoom")
        // allow joining the room
        this.entry = true
        this.players = data.map(index => ({ ...index, name: this.clients?.find((player: Player) => player.id === index.id).name }))

        // start if everyone is ready
        if (!this.players.some((index: Player) => !index.ready)) {
          this.startGame()
        }
      }
    },

    mounted() {
      console.log("HUAHAUAHUUAH")
      this.$socket.emit("moveRoom", this.roomID, "join")
    },

    beforeUnmount() {
      if (this.entry) {
        this.$socket.emit("moveRoom", this.roomID, "leave")
      }
      this.$emit("showHeader", true)
    }
  })
</script>

<style scoped lang="scss">
  @use "variables" as v;

  #game {
    #lobby {
      height: 100%;
      width: 100%;
      flex-direction: row;
      gap: v.$viewport-padding-horizontal;
      justify-content: space-between;

      >div {
        gap: calc(0.5*v.$viewport-padding-vertical);

        &:last-child {
          display: block;
          flex-grow: 1;
        }
      }

      #link {
        flex-direction: row;
        gap: 0.5em;

        input {
          flex-grow: 1;
          text-overflow: ellipsis;
        }
      }
    }

    #lobbySlots {
      max-height: 100%;
      aspect-ratio: 1 / 1;
      gap: calc(0.25*v.$viewport-padding-horizontal);
      margin-left: auto;

      @media (min-height: 0) {
        // 520px
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      #slot {
        aspect-ratio: 1 / 1;
        border-radius: 0.5em;
        background-color: rgba(v.$text-color, 0.2);
        overflow: hidden;
      }
    }
  }
</style>
