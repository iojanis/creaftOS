<template>
  <div
    class="ui inventory fluid padded"
    style="padding-top: 8em!important; padding-bottom: 8em!important; padding-left: 2em; padding-right: 2em;"
  >
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      aria-haspopup=""
      style="position: fixed; width: 100%; z-index: 10;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important; overflow: visible;overflow-y: visible!important;"
    >
      <div class="ui fluid container item" style="border: none!important; ">
        <div class="ui form" style="width: 100%;">
          <div class="ui big fluid transparent icon input">
            <input
              v-model="search"
              style="text-align: center; color: #ffffff!important;padding: 0px"
              placeholder="Search"
              autocomplete="off"
              disabled="disabled"
            >
            <i
              v-if="search.length > 0"
              class="remove link icon"
              style="color: rgba(0, 0, 0, 0.34); margin-right: 4.1em; margin-top: 0.1em;"
              @click="search = ''"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pt-6 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300">
      Go to a users profile to add them to your <strong>current</strong> team
    </div>
    <transition-group
      mode="out-in"
      tag="div"
      class="ui relaxed selection inverted bordered list stackable"
      style="margin-top: 0.5em!important; padding-top: 0em!important;"
      name="fadeDown"
      appear
    >
      <nuxt-link
        v-for="item in items"
        :to="'/whois/' + item.username"
        :key="item.id"
        class="bordered item noselect"
        style="height: 52px;"
        :class="{'selected-team': item.username === $store.state.username}"
      >
        <img
          :src="'https://minotar.net/avatar/' + item.username + '/32.png'"
          draggable="false"
          class="ui avatar image mr-2"
          style="border-radius: 1px!important; height: 35px; width: auto; margin-top: 0.15em;"
          :class="{ player: true, online: item.online }"
        >
        <div class="content">
          <div class="description">
            <span v-if="item.team">{{ item.team }}</span>
            <span v-else>no team</span>
          </div>
          <div class="header elipsis" style="max-width: 160px">
            {{ item.username }}
          </div>
        </div>
        <div class="right floated content" style="margin-top: 0.30em;">
          <div class="description">
<!--            <span>Bounty: {{ item.bounty }} ° XP</span>-->
          </div>
          <div class="header elipsis" style="max-width: 160px">
            {{ item.xp }}° xp
          </div>
        </div>
      </nuxt-link>
    </transition-group>
  </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  auth: false,
  data () {
    return {
      newTeamModal: false,
      editTeamModal: false,
      teamModal: false,
      viewMode: 0,
      items: [],
      search: '',
      teamName: '',
      teamDescription: '',
    }
  },
  mounted() {
    this.getTeams()
  },
  computed: {
    ...mapGetters(['isCurrentlyOnline'])
  },
  methods: {
    getTeams() {
      this.$axios.$get('/users').then(response => {
        this.items = response
        console.log(response)
      })
    },
    changeView () {
      this.viewMode === 0 ? (this.viewMode = 1) : (this.viewMode = 0)
    }
  }
}
</script>

<style>
.ui.floating.label.inventory-item {
  position: relative;
  top: auto !important;
  left: auto !important;
  background: none;
}
.ui.grid > .column:not(.row) {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}
.overlay {
  backdrop-filter: blur(5px) !important;
  /* Height & width depends on how you want to reveal the overlay (see JS below) */
  height: 100vh;
  width: 100vw;
  position: fixed; /* Stay in place */
  left: 0;
  top: 0;
  text-align: center;
  z-index: 11;
  background-color: rgba(6, 7, 50, 0.95); /* Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
}

.team-modal {
  background: rgba(3, 1, 25, 0.8) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
}

.center {
  height: 100vh;
  position: relative;
}

.center div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

p {
  color: #cccccc !important;
}

.selected-team {
  box-shadow: 0 0 0 2pt rgba(255, 255, 255, 0.4);
  border-radius: 1px;
}

</style>
