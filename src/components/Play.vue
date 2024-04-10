<template>
  <div id="play" v-if="playing">
    <div id="playerSlots">
      <div id="slot" :class="{ turn: player.turn, left: player.left, done: player.rank > 0 }"
        v-for="(player, index) in players.filter((index: Player) => index.id !== $store.state.userID)" :key="index">
        <b>{{ player.name }}</b>
        <p v-if="player.left">left the game...</p>
        <div v-else-if="player.rank > 0">
          <h2>{{ player.rank }}</h2>
          <p>{{ nth(player.rank) }}</p>
          <icon :icon="rankIcon(player.rank)" />
        </div>
        <div v-else>
          <h2>{{ player.hand.length }}</h2>
          <p>cards left</p>
        </div>
        <Badge v-if="player.turn">current turn</Badge>
      </div>
    </div>

    <div id="gameSlot">
      <div id="cardRow">
        <TransitionGroup name="card">
          <div v-for="card in currentCards" :key="card.sign + card.num">
            <CardButton :sign="card.sign" :value="card.num" />
          </div>
        </TransitionGroup>
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
          <div v-if="player.rank > 0">
            <h2>{{ player.rank }}</h2>
            <p>{{ nth(player.rank) }}</p>
            <icon :icon="rankIcon(player.rank)" />
          </div>
          <Badge v-if="player?.turn">current turn</Badge>
        </div>
        <Button @click="$socket.emit('playCards', roomID, selection)"
          :disabled="!player?.turn || specialCase !== '' || selection.length === 0 || (currentCards.length > 0 && selection.length !== currentCards.length)"
          class="primary">Play</Button>
      </div>
      <div id="cardRow">
        <TransitionGroup name="hand">
          <div v-for="card in player?.hand" :key="card.sign + card.num">
            <CardButton
              :class="{ selected: selection.some(index => index.sign === card.sign && index.num === card.num) }"
              :disabled="disableCard(card.sign, card.num) || !player?.turn || specialCase !== ''"
              @click="selectCard(card.sign, card.num)" :sign="card.sign" :value="card.num" />
          </div>
        </TransitionGroup>
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
    left: boolean,
    rank: number
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

    emits: ["closeGame"],

    data() {
      return {
        players: [] as Player[],
        undefinedPlayer: {
          id: "",
          name: "",
          hand: [] as Card[],
          turn: false,
          left: false,
          rank: 0
        } as Player,

        // player who played the last currentCards
        lastPlayed: {} as Player,

        playing: false,
        revolution: false,
        specialCase: "",
        delayTime: 3000,

        // cards that were last played
        currentCards: [] as Card[],
        // selected cards during turn
        selection: [] as Card[],
      }
    },

    computed: {
      player(): Player {
        return this.players.find((index: Player) => index.id === this.$store.state.userID) ?? this.undefinedPlayer
      },

      playersLeft(): number {
        return this.players.filter((index: Player) => index.rank === 0 && !index.left).length
      }
    },

    watch: {
      ready(isReady) {
        if (isReady) {
          console.log("READY!")

          // reset any changes from the last round
          this.players = []
          this.revolution = false
          this.lastPlayed = {} as Player
          this.currentCards = []

          this.$socket.emit("setLoaded", this.roomID, this.$store.state.userID)
        }
      },

      playersLeft(playersLeft) {
        switch (playersLeft) {
          case 0: {
            // end the game after a short delay (every player has been placed)
            setTimeout(() => {
              this.playing = false
              this.$emit("closeGame")
            }, this.delayTime)

            // no more turns
            this.players.forEach((player: Player) => {
              player.turn = false
            })
            break
          }
          case 1: {
            // give the last available place to the last player
            const lastPlayer = this.players.find((index: Player) => index.rank === 0 && !index.left)
            // only one player left after game has started?
            if (lastPlayer && this.playing) {
              lastPlayer.rank = this.players.filter((index: Player) => index.rank > 0).length + 1
            }
          }
        }
      },

      lobby(leftInLobby) {
        this.players.forEach((player: Player) => {
          if (!leftInLobby.some((index: Player) => index.id === player.id)) {
            // this player has left from the lobby, therefore also mark him as left in the current game
            player.left = true
          }
        })
      }
    },

    sockets: {
      addLoaded(userID: string) {
        const player = this.lobby?.find((index: Player) => index.id === userID)

        this.players.push({
          ...this.undefinedPlayer,
          id: player.id,
          name: player.name
        })

        if (this.players.length === this.lobby?.length && userID === this.$store.state.userID) {
          // all players games have loaded, start the game by giving out cards (the last client triggers this action).
          this.$socket.emit("getCards", this.roomID)
        }
      },

      giveCards(handouts: [Array<Card[]>, number]) {
        const hands = handouts[0]
        const firstTurn = handouts[1]

        this.players.forEach((player: Player, index: number) => {
          player.hand = hands[index]
          player.turn = index === firstTurn
        })

        this.playing = true
      },

      passTurn() {
        this.newTurn()
      },

      setRank(userID: string) {
        const player = this.players.find((index: Player) => index.id === userID)
        if (player) {
          player.rank = this.players.filter((index: Player) => index.rank > 0).length + 1
        }
      },

      newCurrentCards(cards: Array<Card>) {
        this.lastPlayed = this.players?.find((index: Player) => index.turn) ?? this.undefinedPlayer

        // remove cards from the player hand
        this.players.forEach((player: Player) => {
          player.hand = player.hand.filter((index: Card) => !cards.some((card: Card) => index.num === card.num && index.sign === card.sign))
        })

        // did the player finish by getting rid of all their cards?
        if (this.player.hand.length === 0) {
          this.$socket.emit("setRank", this.roomID, this.$store.state.userID)
        }

        // check the played cards for special cases
        const specialCases: Cases = {
          revolution: cards.length === 4,
          eightStop: cards.some(index => index.num === 8),
          threeSpades: this.currentCards.length === 1 && (cards[0].num === 3 && cards[0].sign === "D") && this.currentCards[0].num === 16
        }

        this.currentCards = cards
        let delay = 0

        // also show special cases one after another
        Object.keys(specialCases).forEach(key => {
          if (specialCases[key as keyof Cases]) {
            setTimeout(() => {
              this.specialCase = key
            }, delay)
            delay = delay + this.delayTime
          }
        })

        setTimeout(() => {
          if (specialCases.eightStop || specialCases.threeSpades) {
            // new stack after the case, no pass
            this.currentCards = []

            // exception: if a player finishes playing all cards by either case, still pass to the next player.
            if (this.lastPlayed.rank > 0) {
              this.newTurn()
            }
          } else {
            this.newTurn()
          }

          // swap the card rank order in case of a (counter-)revolution
          if (specialCases.revolution) {
            this.revolution = !this.revolution
          }

          this.specialCase = ""
          this.selection = []
        }, delay)
      }
    },

    methods: {
      newTurn() {
        this.selection = []

        if (this.playersLeft > 0) {
          const currentPlayer = this.players.findIndex((index: Player) => index.turn)
          let nextPlayer = currentPlayer

          // did the player that would be next leave or finish yet? -> skip
          while ((this.players[nextPlayer].rank > 0 || this.players[nextPlayer].left || nextPlayer === currentPlayer) && this.playersLeft > 0) {
            if (nextPlayer < this.players.length - 1) {
              nextPlayer++
            } else {
              nextPlayer = 0
            }
          }

          this.players[currentPlayer].turn = false
          this.players[nextPlayer].turn = true

          // start a new stack if all players have passed (player has turn again who played the last currentCards)
          if (this.players[nextPlayer].id === this.lastPlayed.id) {
            this.currentCards = []
          }
        }
      },

      selectCard(sign: string, num: number) {
        const cardIndex = this.selection.findIndex(index => index.sign === sign && index.num === num)
        if (cardIndex >= 0) {
          this.selection.splice(cardIndex, 1)
        } else {
          this.selection.push({ sign: sign, num: num })
        }
      },

      disableCard(sign: string, num: number) {
        // if the card is included in the current selection, don't disable it
        if (this.selection.some(index => index.num === num && index.sign === sign)) {
          return false
        }

        // choosing a card
        if (this.selection.length > 0) {
          // disable if not the same value as chosen (except only jokers)
          if (this.selection.some(index => index.num !== num && index.num !== 16) && num !== 16) {
            return true
          }

          // number limit of chosen cards (max. 4)
          if (this.selection.length >= 4) {
            return true
          }
        }

        // by the existing current cards
        if (this.currentCards.length > 0) {
          // number limit of chosen cards (same as currentCards)
          if (this.currentCards.length === this.selection.length) {
            return true
          }

          // exception: only 3-of-Spades can be played on a joker
          if (this.currentCards.length === 1 && this.currentCards[0].num === 16 && num === 3 && sign === "D") {
            return false
          }

          // disable lower (/higher if revolution) cards
          if (num !== 16 && ((!this.revolution && num <= this.currentCards[0].num) || (this.revolution && num >= this.currentCards[0].num))) {
            return true
          }

          //disable all cards that can't meet the amount of cards needed
          if (this.currentCards.length > this.player.hand.filter((index: Card) => index.num === num || index.num === 16).length) {
            // exception: jokers can be combined with the cards of another value (find a card value inside the hand that has enough cards)
            let jokerAvailable = true
            if (num == 16) {
              // keep enabled if a higher (/lower if revolution) value than the currentCards can meet the amount needed together with the joker
              this.player.hand.forEach((card: Card) => {
                if (this.player.hand.filter((index: Card) => index.num === card.num).length + this.player.hand.filter((index: Card) => index.num === 16).length >= this.currentCards.length && ((this.revolution && card.num < this.currentCards[0].num) || (!this.revolution && card.num > this.currentCards[0].num))) {
                  jokerAvailable = false
                }
              })
            }
            return jokerAvailable
          }
        }

        return false
      },

      nth(rank: number) {
        return ["st", "nd", "rd"][((((rank + 90) % 100) - 10) % 10) - 1] || "th"
      },

      rankIcon(rank: number) {
        switch (rank) {
          case 1: {
            return "crown"
          }
          case 2: {
            return "sack-dollar"
          }
          case 3: {
            return "drumstick-bite"
          }
          case 4: {
            return "crow"
          }
        }
      }
    }
  })
</script>

<style scoped lang="scss">
  @use "variables" as v;

  #play {
    position: fixed;
    left: 0;
    top: 0;
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
        height: 100vh;
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

  #noCard {
    position: absolute;
    z-index: -1;
  }

  #slot {
    background-color: rgba(v.$text-color, 0.2);
    padding: 0.75em 1em;
    align-items: center;
    min-width: 25%;
    gap: 0.25em;

    >div {
      flex-direction: row;
      align-items: flex-end;
      gap: 0.4em;

      >svg {
        margin-bottom: 0.25em;
      }
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
      h2,
      b,
      svg {
        color: v.$background-color;
      }
    }

    &.left {
      opacity: 0.25;
    }
  }

  /* apply transition to moving elements */
  .hand-enter-active,
  .hand-leave-active {
    transition: all 0.2s ease-in;
  }

  .hand-leave-to {
    opacity: 0;
    transform: translateY(-1em);
  }

  .card-enter-active,
  .card-leave-active {
    transition: all 0.2s ease-in;
  }

  .card-leave-active {
    position: absolute;
    z-index: -1;
  }

  .card-enter-from,
  .card-leave-to {
    opacity: 0;
  }

  .card-enter-from {
    transform: translateY(-1em);
  }
</style>
