<template>
  <div id="homeScreen">
    <!--
    <div class="container">
      <div style="border:1px solid black" v-bind:key="item" v-for="item in userList">{{item.name}}</div>
      <p><b style="margin-right:4px;font-size:20px">{{userList.length}}</b> player(s) online!</p>
      <div v-bind:key="user" v-for="user in userList">
        <p>{{ user.name }}</p>
      </div>
    </div>
    -->
    test: {{ $store.state.userID }}
    <div class="menu">
      <h1 id="desc">
        Play Tycoon online with other people or create your own party to play
        with friends!
      </h1>
      <div>
        <Button @click="joinParty()" :buttonClass="'primary big'">
          create your own party
        </Button>
        <Button @click="joinGame()" :buttonClass="'secondary big'">
          join a random game
        </Button>
        <Button @click="testConnection()" :buttonClass="'secondary big'">
          join a random game
        </Button>
      </div>
    </div>
    <!--
    <div class="cardContainer">
      <Card :cardValue="16" :cardSign="'E'" style="transform: rotate(-40deg);"/>
      <Card :cardValue="15" :cardSign="'C'" style="transform: rotate(-20deg);"/>
      <Card :cardValue="8" :cardSign="'A'" style="transform: rotate(0deg);"/>
      <Card :cardValue="3" :cardSign="'D'" style="transform: rotate(20deg);"/>
    </div>
    -->
    <div class="cardContainer">
      <!--<img src="../assets/background.png" />-->
    </div>
    <!--
    <div>
      <p>If you have any feedback or just want to say hi, please contact me!</p>
      <a href='mailto:tycoonline.game@gmail.com'><button class="secondary alternate"><icon icon="fa-envelope"/> Mail</button></a>
      <a href='mailto:tycoonline.game@gmail.com'><button class="secondary alternate"><icon icon="fa-brands fa-reddit-alien"/> Reddit</button></a>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/Button.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    Button,
  },

  sockets: {
    connect() {
      console.log("socket connected");
    },
    customEmit() {
      console.log(
        "this method was fired by the socket server. eg: io.emit('customEmit', data)"
      );
    },
    test() {
      console.log("ich bin für heute durch.");
    },
  },

  methods: {
    joinGame() {
      //this.socket.emit('createRoom', false)
    },
    joinParty() {
      //this.socket.emit('createRoom', true)
    },
    testConnection() {
      console.log(this.$route.name);
      this.$store.dispatch("setID", "test");
      this.$socket.emit("test");
    },
  },
});
</script>

<style lang="scss">
@use "variables" as v;
</style>
