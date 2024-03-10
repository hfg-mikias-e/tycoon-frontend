import { Socket } from 'vue-3-socket.io'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: Socket
  }
}