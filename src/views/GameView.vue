<template>
  <div class="home">
    {{ roomID }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "HomeView",
  components: {},

  props: {
    roomID: String,
  },

  mounted() {
    this.$socket.emit("moveRoom", this.roomID, "join")
  },

  beforeUnmount() {
    this.$socket.emit("moveRoom", this.roomID, "leave")
  }
})
</script>

<style lang="scss">
@use "variables" as v;
</style>
