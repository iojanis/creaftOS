<template>
  <div class="ui top fixed inverted blurred menu" style="padding-left: 0.5em; border-bottom: rgba(255, 255, 255, 0.16) 2px solid!important;overflow: hidden!important;">
    <!--<a v-on:click="goBack" class="item" style="padding-left: 0.5em;padding-right: 0.5em;">-->
    <!--<h3 class="ui yellow header boldcraft">-->
    <!--<-->
    <!--</h3>-->
    <!--</a>-->
    <a class="item" @click="toggleNotificationDrawer(true)">
      <h3 class="ui yellow header shaft boldcraft" style="margin-bottom: 0">
        EnderNET
      </h3>
      <div v-if="false" class="ui left pointing inverted blue basic label" style="margin-right: 0em;">
        12
      </div>
    </a>

    <transition
      name="slideDown"
    >
      <div v-if="latestChatMassage" class="item ellipsis" style="padding-left: 2em; padding-right: 2em; z-index: 99!important; width: calc(100% - 250px);">
        {{ latestChatMassage }}
      </div>
    </transition>

    <div class="inverted right menu">
      <a class="ui usermenu inverted item" @click="toggleUserDrawer(true)">
        <div v-if="false" class="ui right pointing inverted basic green label" style="margin-left: 0em;">
          -122°
        </div>
        <img v-if="$store.state && $store.state.username" :src="'https://minotar.net/avatar/' + $store.state.username" :class="{online: isCurrentlyOnline}" style="height: 30px; width: 30px; border-radius: 3px;">
        <img v-else style="height: 30px; width: 30px; border-radius: 3px;" src="https://minotar.net/avatar/steve">
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AppBar',
  data () {
    return {
      latestChatMassage: false
    }
  },
  computed: {
    ...mapGetters(['isCurrentlyOnline'])
  },
  mounted () {
  },
  sockets: {
    player_joined (player) {
      this.latestChatMassage = false
      setTimeout(() => {
        this.latestChatMassage = `${player} joined the game!`
      }, 400)
    },
    player_left (player) {
      this.latestChatMassage = false
      setTimeout(() => {
        this.latestChatMassage = `${player} left the game...`
      }, 400)
    },
    chat_message (event) {
      this.latestChatMassage = false
      setTimeout(() => {
        this.latestChatMassage = `[${event.player}] ${event.message}`
      }, 400)
    }
  },
  methods: {
    ...mapActions(['toggleNotificationDrawer', 'toggleUserDrawer'])
  }
}
</script>

<style scoped>

.online {
  box-shadow: 0 0 0 2pt limegreen;
}

.visible {
  display: block!important;
}

.ui.menu .item>.label:not(.floating) {
    margin-left: 0.8em;
    margin-right: 0.8em;
}

.ellipsis {
  width: calc(100% - 120px);
  overflow:hidden;
  display:inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
