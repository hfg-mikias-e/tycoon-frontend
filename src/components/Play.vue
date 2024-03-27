<template>
  <div id="play" v-if="playing">
    <div id="playerSlots">
      <div id="slot" :class="{ turn: player.turn, left: player.left, done: ranks.includes(player.id) }"
        v-for="(player, index) in players.filter(index => index.id !== $store.state.userID)" :key="index">
        <b>{{ player.name }}</b>
        <p v-if="player.left">left the game...</p>
        <div v-if="ranks.includes(player.id)">
          <p>{{ ranks.indexOf(player.id) + 1 }}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </p>
        </div>
        <div v-else>
          <h2>{{ player.hand.length }}</h2>
          <p>cards left</p>
        </div>
        <Badge v-if="player.turn">current turn</Badge>
      </div>
    </div>

    <p>selection: {{ selection }}</p>
    <p>specialCase: {{ specialCase }}</p>
    <p>passed: {{ passed }}</p>

    <div id="gameSlot">
      <div id="cardRow">
        <div v-for="(card, index) in currentCards" :key="index">
          <CardButton style="pointer-events: none" :sign="card.sign" :value="card.num" />
        </div>
        <div v-if="currentCards.length === 0">
          <CardButton style="pointer-events: none" sign="X" :value="0" />
        </div>
      </div>
    </div>

    <div id="userSlot">
      <div>
        <Button @click="$socket.emit('passTurn', roomID)" :disabled="!player?.turn || specialCase !== ''"
          class="secondary">Pass</Button>
        <div id="slot" :class="{ turn: player?.turn }">
          <div>
            <Badge>you</Badge><b> {{ player?.name }}</b>
          </div>
          <Badge v-if="player?.turn">current turn</Badge>
        </div>
        <Button @click="playCards"
          :disabled="!player?.turn || (selection.length === 0 || (currentCards.length > 0 && selection.length !== currentCards.length))"
          class="primary">Play</Button>
      </div>
      <div id="cardRow">
        <div v-for="(card, index) in player?.hand" :key="index">
          <CardButton :class="{ selected: selection.some(index => index.sign === card.sign && index.num === card.num) }"
            :disabled="disableCard(card.sign, card.num) || !player?.turn || specialCase !== ''"
            @click="selectCard(card.sign, card.num)" :sign="card.sign" :value="card.num" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import CardButton from "@/components/Card.vue"
  import Badge from "@/components/Badge.vue"
  import Button from "@/components/Button.vue"

  interface Card {
    sign: string,
    num: number
  }

  interface Player {
    id: string,
    name: string,
    hand: Card[]
    turn: boolean,
    left: boolean
  }

  interface Cases {
    eightStop: boolean,
    threeSpades: boolean,
    revolution: boolean
  }

  export default defineComponent({
    components: {
      CardButton,
      Badge,
      Button
    },

    props: {
      lobby: Object,
      roomID: String,
      ready: Boolean
    },

    data() {
      return {
        players: [] as Player[],
        playing: false,
        ranks: [] as string[],
        passed: 0,
        turn: 0,

        delay: 0,
        revolution: false,
        specialCase: "",

        // cards that were last played
        currentCards: [] as Card[],
        // selected cards during turn
        selection: [] as Card[]
      }
    },

    computed: {
      player(): Player {
        return this.players.find((index: Player) => index.id === this.$store.state.userID) ?? {
          id: this.$store.state.userID,
          name: "–",
          hand: [] as Card[],
          turn: false,
          left: false
        }
      }
    },

    watch: {
      ready(isReady) {
        if (isReady) {
          this.$socket.emit("setLoaded", this.roomID, this.$store.state.userID)
        }
      }
    },

    sockets: {
      addLoaded(userID: string) {
        const player = this.lobby?.find((index: Player) => index.id === userID)

        this.players.push({
          id: player.id,
          name: player.name,
          hand: [] as Card[],
          turn: false,
          left: false
        })

        if (this.players.length === this.lobby?.length && userID === this.$store.state.userID) {
          // all players games have loaded, start the game by giving out cards (the last client triggers this action).
          this.$socket.emit("getCards", this.roomID)
        }
      },

      giveCards(handouts: [Array<Card[]>, number]) {
        console.log("giveCards")

        const hands = handouts[0]
        const firstTurn = handouts[1]

        this.players.forEach((player: Player, index: number) => {
          player.hand = hands[index]
          player.turn = index === firstTurn
        })

        this.playing = true
      },

      passTurn() {
        // check if all players have passed
        this.passed++
        if (this.passed >= this.players.length - 1) {
          this.currentCards = []
        }

        this.selection = []
        this.newTurn()
      },

      setRank(userID: string) {
        this.ranks.push(userID)
      },

      newCurrentCards(cards: Array<Card>) {
        // remove cards from the player hand
        this.players.forEach((player: Player) => {
          player.hand = player.hand.filter((index: Card) => !cards.some((card: Card) => index.num === card.num && index.sign === card.sign))
        })

        // reset any series of passes
        this.passed = 0

        // check the played cards for special cases
        const specialCases: Cases = {
          revolution: cards.length === 4,
          eightStop: cards.some(index => index.num === 8),
          threeSpades: this.currentCards.length === 1 && (cards[0].num === 3 && cards[0].sign === "D") && this.currentCards[0].num === 16
        }

        this.currentCards = cards

        // also show special cases
        Object.keys(specialCases).forEach(key => {
          if (specialCases[key as keyof Cases]) {
            setTimeout(() => {
              this.specialCase = key
            }, this.delay)
            this.delay = this.delay + 3000
          }
        })

        setTimeout(() => {
          if (specialCases.eightStop || specialCases.threeSpades) {
            // new stack after the case, no pass
            this.currentCards = []
          } else {
            console.log("MACH WAS")
            this.newTurn()
          }

          this.delay = 0
          this.specialCase = ""
          this.selection = []
        }, this.delay)
      }
    },

    methods: {
      newTurn() {
        let newTurn = 0
        if (this.turn < this.players.length - 1) {
          newTurn = this.turn + 1
        }

        this.players[this.turn].turn = false
        this.players[newTurn].turn = true
        this.turn = newTurn
      },

      selectCard(sign: string, num: number) {
        const cardIndex = this.selection.findIndex(index => index.sign === sign && index.num === num)
        if (cardIndex >= 0) {
          this.selection.splice(cardIndex, 1)
        } else {
          this.selection.push({ sign: sign, num: num })
        }
      },

      playCards() {
        // selected cards become new current cards for every player
        this.$socket.emit("playCards", this.roomID, this.selection)

        // did the player finish by getting rid of all their cards?
        if (this.player.hand.length === 0) {
          this.$socket.emit("setRank", this.roomID, this.$store.state.userID)
        }
      },

      disableCard(sign: string, num: number) {
        // if the card is included in the current selection, don't disable it
        if (this.selection.some(index => index.num === num && index.sign === sign)) {
          return false
        }

        // number limit of chosen cards (max. 4)
        if (this.selection.length >= 4) {
          return true
        }

        // choosing a card
        if (this.selection.length > 0) {
          // disable if not the same value as chosen (except only jokers)
          if (this.selection.some(index => index.num !== num && index.num !== 16) && num !== 16) {
            return true
          }
        }

        // by the existing current cards
        if (this.currentCards.length > 0) {
          // exception: 3-of-Spades can be played on a joker
          if (num === 3 && sign === "D" && this.currentCards.length === 1 && this.currentCards[0].num === 16) {
            return false
          }

          // disable lower (/higher if revolution) cards or if max. number of cards chosen
          if (num !== 16 && (this.currentCards.length === this.selection.length || (!this.revolution && num <= this.currentCards[0].num) || (this.revolution && num >= this.currentCards[0].num))) {
            return true
          }

          //disable all cards that can't meet the amount of cards needed
          if (this.currentCards.length > this.player.hand.filter((index: Card) => index.num === num || index.num === 16).length) {
            // exception: jokers can be combined with the cards of another value (find a card value inside the hand that has enough cards)
            let jokerAvailable = true
            if (num == 16) {
              this.player.hand.forEach((card: Card) => {
                if (this.player.hand.filter((index: Card) => index.num === card.num).length + this.player.hand.filter((index: Card) => index.num === 16).length >= this.currentCards.length && card.num > this.currentCards[0].num) {
                  jokerAvailable = false
                }
              })
            }
            return jokerAvailable
          }
        }

        return false
      },
    },
  });
</script>

<style scoped lang="scss">
  @use "variables" as v;

  #play {
    margin: calc(-1*v.$viewport-padding-vertical) calc(-1*v.$viewport-padding-horizontal);
    height: 100vh;
    width: 100vw;
    justify-content: space-between;
  }

  #playerSlots,
  #gameSlot {
    flex-direction: row;
    justify-content: center;
    height: fit-content;
  }

  #playerSlots {
    gap: v.$viewport-padding-horizontal;

    #slot {
      border-radius: 0 0 0.5em 0.5em;
      padding-bottom: 1.25em;

      #badge {
        position: absolute;
        transform: translateY(50%);
        bottom: 0;
      }
    }
  }

  #userSlot {
    align-items: center;
    gap: 1em;

    >div:first-child {
      flex-direction: row;
      justify-content: space-between;
      gap: 1em;
    }

    #cardRow {
      align-items: flex-start;
    }

    #slot {
      border-radius: 0.5em 0.5em 0 0;
      padding-top: 1.25em;

      &::after {
        position: absolute;
        content: "";
        background-color: inherit;
        top: 100%;
        width: 100%;
        height: 20vh;
      }

      >#badge {
        position: absolute;
        transform: translateY(-50%);
        top: 0;
      }
    }
  }

  #cardRow {
    width: 100%;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    overflow: visible;
    max-height: 20vh;

    >div {
      max-width: 6vw;
      align-items: center;
    }
  }

  #slot {
    background-color: rgba(v.$text-color, 0.2);
    padding: 0.75em 1em;
    align-items: center;
    min-width: 25%;
    gap: 0.25em;

    >div {
      flex-direction: row;
      gap: 0.4em;
      align-items: flex-end;
    }

    &.turn {
      background-color: v.$text-color;

      >div {
        #badge {
          background-color: v.$background-color;
          color: v.$text-color;
        }
      }

      p,
      b {
        color: v.$background-color;
      }
    }

    &.left {
      opacity: 0.25;
    }
  }
</style>
