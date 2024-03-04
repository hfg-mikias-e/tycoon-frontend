<template>
  <div id="play">
    <div id="lobbySlots">
      <div id="lobbyCard" :class="{ turn: player.turn, }" v-for="(player, index) in players" :key="index">
        {{ player.id }}
        {{ player.turn }}
        {{ player.name }}
      </div>
      <div id="lobbyCard" class="empty" v-for="index in players?.length" :key="index">waiting for
        another
        player ...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

interface Player {
  id: string,
  name: string,
  turn: boolean,
  left: boolean
}

export default defineComponent({
  props: {
    lobby: Object
  },

  data() {
    return {
      players: [] as Player[],
    }
  },

  mounted() {
    console.log(this.lobby)
    const lobbyPlayers: Player[] = this.lobby?.map((index: object) => ({
      ...index,
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
}
</style>
