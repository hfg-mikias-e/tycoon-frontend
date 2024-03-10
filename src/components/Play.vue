<template>
  <div id="play">
    <div id="gameSlots">
      <div id="slot" :class="{ turn: player.turn, left: player.left }"
        v-for="(player, index) in players.filter(index => index.id !== $store.state.userID)" :key="index">
        <p>{{ player.name }}</p>
        <p>14 cards left</p>
        <Badge v-if="player.turn">CURRENT TURN</Badge>
      </div>
    </div>
    <div id="userSlot">
      <div id="slot" :class="{ turn: player.turn }"
        v-for="(player, index) in players.filter(index => index.id !== $store.state.userID)" :key="index">
        <p>{{ player.name }}</p>
        <Badge v-if="player.turn">CURRENT TURN</Badge>
      </div>
      <div id="hand">
        <div v-for="number in numbers" :key="number">
          <Card sign="A" :value="3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Card from "@/components/Card.vue"
import Badge from "@/components/Badge.vue"

interface Player {
  id: string,
  name: string,
  turn: boolean,
  left: boolean
}

export default defineComponent({
  components: {
    Card,
    Badge
  },

  props: {
    lobby: Object
  },

  data() {
    return {
      players: [] as Player[],
      numbers: 14
    }
  },

  mounted() {
    const lobbyPlayers: Player[] = this.lobby?.map((index: Player) => ({
      id: index.id,
      name: index.name,
      turn: false,
      left: false
    }))
    this.players = lobbyPlayers
  }
});
</script>

<style scoped lang="scss">
@use "variables" as v;

#play {
  height: 100%;
  width: 100%;

  div {
    align-items: center;
  }
}

#gameSlots {
  flex-direction: row;
}

#userSlot {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;

  #hand {
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    overflow: visible;
    max-height: 25vh;

    >div {
      max-width: 6vw;

      // Card
      >button {
        width: 200%;
      }
    }

  }
}

#slot {
  padding: 1em;
  background-color: rgba(v.$text-color, 0.6);
  flex-grow: 1;
  max-width: 25%;
}
</style>
