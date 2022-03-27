<template>
  <div
    class="ui terminal inverted fluid container padded"
    style="padding-top: 8em!important; padding-bottom: 8em; padding-left: 2em; padding-right: 2em;"
  >
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      aria-haspopup=""
      style="position: fixed; width: 100%; z-index: 100;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important;overflow: visible;overflow-y: visible!important;"
    >
      <div class="ui fluid container item" style="border: none!important; ">
        <div class="ui form" style="width: 100%;">
          <div
            :class="{ disabled: !$auth.loggedIn }"
            class="ui big fluid transparent input"
          >
            <a
              data-inverted=""
              data-tooltip="It's currently day!"
              data-position="bottom left"
            >
              <i
                class="sun icon light"
                style="margin-top: 0.4em; color: rgba(0, 0, 0, 0.34); margin-right: 0.5em;"
              />
            </a>
            <input
              v-model="message"
              placeholder="Message"
              style="text-align: center; color: #ffffff!important;padding: 0px;"
              autocomplete="off"
              @keyup.enter="sendChatMessage"
            >
            <a
              data-inverted=""
              data-tooltip="Send Message"
              data-position="bottom right"
            >
              <i
                class="level down rotated icon light"
                style="margin-top: 0.3em; color: #ffffff!important;cursor: pointer"
                @click="sendChatMessage"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <transition name="zoom">
      <div
        v-if="getOnlinePlayers.length > 0"
        style="margin-top: 1em; overflow-x: hidden; overflow-y:hidden; white-space: nowrap; padding: 0.5em;"
      >
        <transition-group mode="inout" name="zoom">
          <nuxt-link
            v-for="player in getOnlinePlayers"
            :key="player"
            to="/"
            style="margin-right: 0.5em;"
          >
            <img
              :src="'https://minotar.net/avatar/' + player"
              style="border-radius: 3px!important; height: 35px;box-shadow: 0 0 0 2pt limegreen;"
            >
          </nuxt-link>
        </transition-group>
      </div>
    </transition>

    <transition-group
      mode="in"
      tag="div"
      class="ui inverted feed"
      name="fadeDown"
      appear
    >
      <div
        v-for="(message, i) in getLatestMessages"
        :key="'i' + i"
        :data="message"
        class="event"
      >
        <div class="label">
          <img
            :src="'https://minotar.net/avatar/' + message.player"
            :class="{ player: true, online: isOnline(message.player) }"
            style="border-radius: 3px!important; margin-top: 0.15em;"
          >
        </div>
        <div class="content">
          <div class="date">
            Today
          </div>
          <div class="summary">
            [{{ message.player }}] {{ message.message }}
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  auth: false,
  data () {
    return {
      message: ''
    }
  },
  computed: {
    ...mapGetters({
      getLatestMessages: 'latestMessages',
      getOnlinePlayers: 'onlinePlayers'
    })
  },
  methods: {
    sendChatMessage () {
      console.log('sent')
      if (this.message.length > 3) {
        this.$socket.emit('send-chat-message', this.message)
        this.message = ''
      }
    },
    isOnline (player) {
      const index = this.getOnlinePlayers.indexOf(player)
      if (index > -1) {
        return true
      }
    }
  }
}
</script>

<style>
.ui.inverted.feed > .event {
  background: none;
}
.player.online {
  box-shadow: 0 0 0 2pt limegreen;
}
.player.online.web {
  box-shadow: 0 0 0 2pt dodgerblue;
}
</style>
