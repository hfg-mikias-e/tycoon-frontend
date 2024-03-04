import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import GameView from "@/views/GameView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/party/:roomID",
    name: "party",
    component: GameView,
    props: true,
  },
  {
    path: "/:roomID",
    name: "random",
    component: GameView,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
