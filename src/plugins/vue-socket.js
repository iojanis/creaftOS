import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io-extended'

export default ({ store }) => {
  Vue.use(VueSocketIO, io({ url: 'http://192.168.178.20:4000' }), { store })
}
