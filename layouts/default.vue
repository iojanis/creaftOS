<template>
  <div class="default-layout">
    <app-bar/>
    <app-notifications/>
    <app-usermenu/>
    <app-overlay/>
    <app-crashed/>
    <div>
      <nuxt/>
    </div>
    <app-nav/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppOverlay from '../components/app/AppOverlay'
import AppCrashed from '../components/app/AppCrashed'
import AppBar from '~/components/app/AppBar'
import AppNav from '~/components/app/AppNav'
import AppNotifications from '~/components/app/AppNotifications'
import AppUsermenu from '~/components/app/AppUsermenu'

export default {
  components: {
    AppCrashed,
    AppOverlay,
    AppNotifications,
    AppUsermenu,
    AppBar,
    AppNav
  },
  watch: {
    $route() {
      this.toggleAll(false)
    }
  },
  mounted() {
    this.$store.watch(
      (state) => {
        try {
          console.log(this.$store.state.auth.user.username)
          this.setToken(this.$auth.getToken('local'))
          this.$socket.emit('auth', {
            token: this.$auth.getToken('local'),
            user: this.$auth.user.username
          })
          return this.$store.state.auth.loggedIn
        } catch (e) {
          console.log(e)
        }
      }, (val) => {
      }, { deep: true }
    )
  },
  methods: {
    ...mapActions(['setToken', 'toggleAll'])
  }
}
</script>

<style>

  input, textarea {
    color: #ffffff!important;
    box-shadow: none!important;
    font-family: 'Minecraftia';
    backdrop-filter: blur(5px)!important;
    background: rgba(17, 19, 33, 0.9) !important;
    border: 2px solid rgba(255, 255, 255, 0.4) !important;
  }

  input:active, textarea:active {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(17, 19, 33, 0.9) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
  }

  input:focus, textarea:focus {
    color: #ffffff!important;
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(17, 19, 33, 0.9) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
  }

  .page-enter-active,
  .page-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 100ms;
  }
  .page-enter,
  .page-leave-to {
    opacity: 0;
  }

  .fastfade-enter-active,
  .fastfade-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 10ms;
  }
  .fastfade-enter,
  .fastfade-leave-to {
    opacity: 0;
  }

  .icon {
    color: rgba(250, 250, 250, 1)!important;
  }
  .icon.disabled {
    color: rgba(250, 250, 250, 0.4)!important;
  }

  @font-face {
    font-family: 'Minecraftia';
    src: url('/fonts/MinecraftiaRegular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'MinecraftiaRegular';
    src: url('/fonts/MinecraftiaRegular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .ui.menu .item:before {
    width: 0px!important;
    background: none!important;
  }

  body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    background: #14101f!important;
    font-family: 'MinecraftiaRegular' !important;
    font-weight: normal !important;
    font-style: normal !important;
  }

  .fonta {
    font-family: 'MinecraftiaRegular' !important;
    font-weight: normal !important;
    font-style: normal !important;
  }

  .header {
    font-family: 'MinecraftiaRegular' !important;
    font-weight: normal !important;
    font-style: normal !important;
  }

  .blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(242, 242, 242, 0.8)!important;
  }

  .second.blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(242, 242, 242, 0.6)!important;
  }

  .translucent.segment {
    box-shadow: none!important;
    background: transparent!important;
  }

  .inverted.second.blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(17, 19, 33, 0.9) !important;
  }

  .inverted.third.blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(17, 19, 33, 0.9) !important;
  }

  .inverted.blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(3, 1, 25, 0.9) !important;
  }

  @font-face {
    font-family: 'Minecraftia';
    src: url('/fonts/MinecraftiaRegular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'MinecraftiaRegular';
    src: url('/fonts/MinecraftiaRegular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  input {
    font-family: 'MinecraftiaRegular' !important;
    font-weight: normal !important;
    font-style: normal !important;
  }

  .ui {
    font-family: 'MinecraftiaRegular' !important;
    font-weight: normal !important;
    font-style: normal !important;
  }

  .elipsis {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display:inline-block;
  }

  .ui.menu .dropdown.item .menu {
    background: rgba(16, 19, 34, 0.88)!important;
    z-index: 111111!important;
    border: rgba(255, 255, 255, 0.3) 2px solid !important;
  }

  .ui.menu .dropdown.item .menu>.item:hover {
    color: #ffffff!important;
  }

  /* Arrow */
  [data-tooltip][data-inverted]:before {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }

  /* Arrow Position */
  [data-tooltip][data-inverted]:before {
    background: rgba(255, 255, 255, 0)!important;
  }

  /* Popup  */
  [data-tooltip][data-inverted]:after {
    background: #201c31!important;
    color: #FFFFFF;
    opacity: 0.95;
    border: 2px solid #4b4a5a!important;
    -webkit-box-shadow: none;
    box-shadow: none;
    z-index: 11111;
  }
  [data-tooltip][data-inverted]:after .header {
    background-color: none;
    color: #FFFFFF;
  }
  a {
    color: #ffffff;
  }
  a:hover {
    color: #cccccc;
    /*border-bottom: 2px solid #cccccc;*/
  }
</style>
