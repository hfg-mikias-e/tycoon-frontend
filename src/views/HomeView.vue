<template>
  <div id="homeScreen">
    <div class="menu">
      <h1 id="desc">
        Play Tycoon online with other people or create your own party to play
        with friends!
      </h1>
      <div>
        <Button @click="joinGame('party')" :buttonClass="'primary big'">
          create your own party
        </Button>
        <Button @click="joinGame('random')" :buttonClass="'secondary big'">
          join a random game
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Button from "@/components/Button.vue"

export default defineComponent({
  name: "HomeView",
  components: {
    Button,
  },

  sockets: {
    connect() {
      console.log("socket connected")
    },

    joinRoom(room: Array<string>) {
      const roomID = room[0]
      const roomType = room[1]
      this.$router.push({ name: roomType, params: { roomID } })
    },
  },

  methods: {
    joinGame(roomType: string) {
      this.$socket.emit("findGame", roomType)
    },
  }
})
</script>

<style lang="scss">
@use "variables" as v;
</style>
