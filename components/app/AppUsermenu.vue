<template>
  <transition name="slideRight">
    <div v-if="$store.state.UserDrawer" class="ui right notification-bar vertical inverted sidebar visible menu" style="z-index: 105">
      <div v-if="$auth.loggedIn" style="padding: 0.5em;">
        <nuxt-link :to="'/whois/' + $auth.user.username">
          <img :src="'https://minotar.net/avatar/' + $auth.user.username" :class="{online: isCurrentlyOnline}" style="height: 30px; width: 30px; border-radius: 3px; float:right; margin-right: 9px; margin-top: 2px">
          <span style="color: #ffffff; float: right; margin-right: 15px; margin-top: 8px;" class="ellipsis">{{ $auth.user.username }}</span>
        </nuxt-link>
      </div>
      <div v-else style="padding: 0.5em;">
        <nuxt-link to="/login">
          <img :src="'https://minotar.net/avatar/steve'" style="height: 30px; width: 30px; border-radius: 3px; float:right; margin-right: 9px; margin-top: 2px">
          <span style="color: #ffffff; float: right; margin-right: 15px; margin-top: 8px">or Login</span>
        </nuxt-link>
        <nuxt-link to="/join">
          <span style="color: #ffffff; float: right; margin-right: 15px; margin-top: 8px">Join</span>
        </nuxt-link>
      </div>
      <div v-if="$auth.loggedIn" style="margin-top: 2.5em;">
        <div class="item">
          <span class="ui green inverted basic label noselect">
            <a v-if="isCurrentlyOnline" class="detail" style="margin-left: 0"><i class="arrow down icon" style="margin: 0" @click="downloadExp"/></a>
            <span v-else class="detail" style="margin-left: 0"><i class="arrow down icon disabled" style="margin: 0"/></span>
            {{ currentExp }}°
            <a v-if="isCurrentlyOnline" class="detail" style="margin-left: 0"><i class="arrow up icon" style="margin: 0" @click="uploadExp"/></a>
            <span v-else class="detail" style="margin-left: 0"><i class="arrow up icon disabled" style="margin: 0"/></span>
          </span>
        </div>
        <nuxt-link :to="'/whois/' + $auth.user.username" class="disabled item">
          My Profile
        </nuxt-link>
        <nuxt-link to="/setttings" class="disabled item">
          Settings
        </nuxt-link>
        <div class="divider"/>
        <nuxt-link to="/manual" class="disabled item">
          CraftOS Manual
        </nuxt-link>
        <nuxt-link to="/roadmap" class="disabled item">
          Roadmap
        </nuxt-link>
        <div class="divider"/>
        <a class="item" @click="logOut()">
          Logout
        </a>
      </div>
      <div class="item" style="position: absolute; bottom: 0; right: 0; padding-right: 2em">
        CraftOS αv3.1.0
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AppUsermenu',
  computed: {
    ...mapGetters(['currentExp', 'isCurrentlyOnline'])
  },
  methods: {
    ...mapActions(['downloadExp', 'uploadExp', 'toggleUserDrawer']),
    async logOut() {
      console.log('logging out')
      await this.$auth.logout()
    }
  }
}
</script>

<style scoped>

.online {
  box-shadow: 0 0 0 2pt limegreen;
}

.notification-bar {
    background: rgba(3, 1, 25, 0.8) !important;
    border-left: 2px solid rgba(255, 255, 255, 0.2) !important;;
}

.menu .divider {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2) !important; margin-top: 0.5em; margin-bottom: 0.5em;
}

.ellipsis {
  overflow:hidden;
  display:inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
