import { createApp } from "vue"
import App from "./App.vue"
import './registerServiceWorker'
import router from "./router"
import store from "./store"
import VueSocketIO from "vue-3-socket.io"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(fas, far, fab)

createApp(App)
  .component("icon", FontAwesomeIcon)
  .use(new VueSocketIO({
    connection: process.env.VUE_APP_SOCKET_ENDPOINT
  }))
  .use(store)
  .use(router)
  .mount("#app")
