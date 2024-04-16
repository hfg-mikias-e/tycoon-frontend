<template>
  <div id="game">
    <template v-if="entry">
      <Transition name="fade">
        <Alert v-if="shared" class="success" @closeAlert="shared = false">Successfully shared the Game!</Alert>
      </Transition>
      <Transition name="fade" mode="out-in">
        <div id="lobby" v-if="!started">
          <div>
            <div>
              <div id="lobbySlots">
                <div id="slot" class="container" :class="{ ready: player.ready }" v-for="(player, index) in players"
                  :key="index">
                  <div>
                    <Badge v-if="player.id === $store.state.userID">YOU</Badge>
                    <b>{{ player.name }}</b>
                  </div>
                  <h4 v-if="player.ready">ready!</h4>
                  <h4 v-else>not ready yet</h4>
                </div>
                <div id="slot" class="container empty" v-for="index in (maxPlayers - players.length) " :key="index">
                  <h4>wait for a player ...</h4>
                </div>
              </div>
            </div>
          </div>

          <div class="container" id="gameInfo">
            <h2 class="title">Game <span class="accent">#{{ roomID }}</span></h2>
            <Transition name="fade" mode="out-in">
              <div v-if="$route.name === 'party' && !showCounter">
                <div>
                  <p>Invite your friends over the following link!</p>
                  <p class="note">Note that you can currently invite
                    <span v-if="maxPlayers - players.length === 0">no</span>
                    <b v-else>{{ maxPlayers - players.length }}</b>
                    more player<span v-if="maxPlayers - players.length !== 1">s</span>.
                  </p>
                </div>
                <div id="link">
                  <div>
                    <input readonly :value="link" />
                    <Button :icon="copied ? 'check' : 'fa-regular fa-clipboard'" @click="copyToClipboard">Copy</Button>
                  </div>
                  <Button v-if="shareable" class="secondary" icon="share" @click="shareLink">Share</Button>
                </div>
              </div>
              <div v-else-if="!showCounter">
                <div>
                  <p>This is an open game which can be joined by anyone!</p>
                  <p class="note">Note that this game needs 4 players before the it can be started.</p>
                </div>
              </div>
              <div v-else>
                <h3>The game starts in...</h3>
                <Counter :number="counter" />
              </div>
            </Transition>
            <div id="ready">
              <b>The game will start when everyone is ready.</b>
              <Button class="primary" :disabled="showCounter"
                :icon="players.find((player: Player) => player.id === $store.state.userID)?.ready ? 'circle-check' : 'circle-dot'"
                @click="$socket.emit('setReady', roomID, $store.state.userID, !players.find((player: Player) => player.id === $store.state.userID)?.ready)">I'm
                ready!</Button>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade" mode="out-in" v-if="showCounter">
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
  import Badge from "@/components/Badge.vue"
  import Counter from "@/components/Counter.vue"
  import Play from "@/components/Play.vue"
  import Alert from "@/components/Alert.vue"

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
      Counter,
      Alert
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
        copied: false,

        counter: 3,
        showCounter: false,
        started: false,
        entry: false,

        shared: false,
        shareable: false,
        shareContent: {
          text: "Let's play Tycoon together! Join my party now (WebApp users: if the following link does not open correctly, copy it to your clipboard and hit \"join someone's party\" inside the App)!",
          url: window.location.href
        }
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
        console.log("resetGame")

        // set all ready states back to the default
        await this.players.forEach((player: Player) => {
          this.$socket.emit("setReady", this.roomID, player.id, false)
        })

        // reset all to default value
        this.counter = 3
        this.started = false
        this.showCounter = false
        this.$emit("showHeader", true)

        this.$socket.emit('startGame', this.roomID, false)
      },

      copyToClipboard() {
        navigator.clipboard.writeText(this.shareContent.text + " " + this.link)
      },

      shareLink() {
        navigator.share(this.shareContent).then(() => {
          this.shared = true
        }).catch((error) => {
          console.log(error)
        })
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
      this.$socket.emit("moveRoom", this.roomID, "join")

      // if the sharing function is supported, additionally present a direct share button
      if (navigator['share'] && navigator.canShare(this.shareContent)) {
        this.shareable = true
      }
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
      flex-direction: row;
      justify-content: space-between;
      gap: v.$viewport-padding-horizontal;
      width: 100%;
      height: 100%;

      >div {
        flex-basis: 100%;
        justify-content: center;

        &:first-child {
          @media (max-height: 400px) {
            padding-bottom: v.$viewport-padding-vertical;
          }

          >div {
            max-height: 100%;
            display: block;
          }
        }

        &:last-child {
          align-self: center;

          @media (max-height: 400px) {
            align-self: flex-end;
            border-radius: 0.75em 0.75em 0 0;
          }
        }

        .title {
          flex-direction: row;
          position: absolute;
          gap: 0.2em;
          bottom: 100%;
          width: 100%;

          >div {
            gap: 0.25em;
          }
        }
      }

      #link {
        flex-direction: row;
        gap: 0.5em;

        >div {
          flex-grow: 1;
          border-radius: 0.75em;
          background-color: rgba(v.$text-color, 0.05);
          flex-direction: row;
          gap: 0.5em;
          padding: 0 1em 0 1.25em;
          min-height: 3.5em;
          max-height: 100%;

          input {
            flex-grow: 1;
            text-overflow: ellipsis;
          }
        }
      }

      #ready {
        align-items: center;
        gap: 0.5em;

        >button {
          width: 100%;
        }

        b {
          text-align: center;
        }

        span {
          height: 1em;
          display: inline-flex;
          align-items: flex-end;
          line-height: 1;
          gap: 0.25em;
        }
      }

      h2 span.accent {
        color: v.$primary-color;
        text-transform: none;
      }
    }

    #lobbySlots {
      display: grid;
      aspect-ratio: 1 / 1;
      gap: calc(0.25*v.$viewport-padding-horizontal);
      grid-template-columns: 1fr 1fr;
      height: 100%;

      #slot {
        aspect-ratio: 1 / 1;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 1em;
        gap: 0.75em;

        &.empty {
          background: rgba(v.$background-color, 0.25);
        }

        >h4 {
          text-align: center;
        }

        >div {
          flex-direction: row;
          max-width: 100%;
          gap: 0.25em;

          >b {
            text-overflow: ellipsis;
            overflow: auto;
          }
        }
      }
    }
  }

  #gameInfo {
    >div:first-of-type {
      gap: inherit;

      >* {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>
