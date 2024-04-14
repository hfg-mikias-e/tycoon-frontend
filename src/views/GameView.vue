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
                  <Badge v-if="player.id === $store.state.userID">YOU</Badge>
                  <p>{{ player.name }}</p>
                  <Badge v-if="player.ready">READY!</Badge>
                  <p v-else>not ready yet</p>
                </div>
                <div id="slot" class="container empty" v-for="index in (maxPlayers - players.length) " :key="index">
                  waiting ...
                </div>
              </div>
            </div>
          </div>

          <div class="container">
            <h2 class="title">Game <span class="accent">#{{ roomID }}</span></h2>
            <template v-if="$route.name === 'party'">
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
            </template>
            <template v-else>
              <div>
                <p>This is an open game which can be joined by anyone!</p>
                <p class="note">Note that this game needs 4 players before the it can be started.</p>
              </div>
            </template>
            <div id="ready">
              <b>The game will start when everyone is ready.</b>
              <Button class="primary" :disabled="showCounter"
                @click="$socket.emit('setReady', roomID, $store.state.userID, !players.find((player: Player) => player.id === $store.state.userID)?.ready)">
                <span v-if="showCounter">The game starts in...
                  <Counter :number="counter" />
                </span>
                <span v-else>I'm ready!
                  <icon v-if="!players.find((player: Player) => player.id === $store.state.userID)?.ready"
                    icon="circle-dot" />
                  <icon v-else icon="circle-check" />
                </span>
              </Button>
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
      gap: calc(2*v.$viewport-padding-horizontal);
      width: 100%;
      height: 100%;

      >div {
        flex-basis: 100%;
        gap: calc(0.5*v.$viewport-padding-vertical);
        justify-content: center;

        &:first-child>div {
          max-height: 100%;
          display: block;
        }

        &:last-child {
          align-self: center;
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
        overflow: hidden;
        padding: 1em;
      }
    }
  }
</style>
