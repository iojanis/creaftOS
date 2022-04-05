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
        class="flex flex-row"
      >
        <transition-group class="flex" mode="inout" name="zoom">
          <nuxt-link
            v-for="player in getOnlinePlayers"
            :key="player"
            :to="'/whois/' + player"
            style="margin-right: 1em;"
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
            {{ timeAgo(new Date(message.time)) }}

          </div>
          <div class="summary">
            [{{ message.player }}] {{ message.message }}
          </div>
        </div>
      </div>
    </transition-group>
    <div class="p-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
      Messages will vanish after a restart.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours()
  let minutes = date.getMinutes()

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${ minutes }`
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${ prefomattedDate } at ${ hours }:${ minutes }`
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${ day }. ${ month } at ${ hours }:${ minutes }`
  }

  // 10. January 2017. at 10:20
  return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`
}

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
    },
    timeAgo(dateParam) {
      if (!dateParam) {
        return null
      }

      const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
      const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
      const today = new Date()
      const yesterday = new Date(today - DAY_IN_MS)
      const seconds = Math.round((today - date) / 1000)
      const minutes = Math.round(seconds / 60)
      const isToday = today.toDateString() === date.toDateString()
      const isYesterday = yesterday.toDateString() === date.toDateString()
      const isThisYear = today.getFullYear() === date.getFullYear()


      if (seconds < 5) {
        return 'now'
      } else if (seconds < 60) {
        return `some seconds ago`
      } else if (seconds < 90) {
        return 'a minute ago'
      } else if (minutes < 60) {
        return `${ minutes } minutes ago`
      } else if (isToday) {
        return getFormattedDate(date, 'Today') // Today at 10:20
      } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday') // Yesterday at 10:20
      } else if (isThisYear) {
        return getFormattedDate(date, false, true) // 10. January at 10:20
      }

      return getFormattedDate(date) // 10. January 2017. at 10:20
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
