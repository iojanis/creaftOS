<template>
  <div
    class="ui inventory fluid  padded"
    style="
      padding-top: 8em !important;
      padding-bottom: 8em !important;
      padding-left: 2em;
      padding-right: 2em;
    "
  >
    <div
      v-if="newTeamModal && isCurrentlyOnline && $store.state.currentTeam === item.slug"
      class="ui dimmer modals page visible active overlay"
      style="display: flex !important"
      @click="newTeamModal = false"
    >
      <div
        class="ui mini inverted modal front visible active team-modal"
        style="display: block !important"
        @click.stop=""
      >
        <div class="content" style="background: none !important">
          <form class="ui inverted fonta form" @submit.prevent="createZone()">
            <h1 class="ui yellow header" style="text-align: center">
              New Zone
            </h1>
            <div class="inverted field" style="text-align: center">
              <label style="color: white">
                Zone Center: X: {{ $auth.user.joined_x }} Y: {{ $auth.user.joined_y }} Z: {{ $auth.user.joined_z }}
                <button
                  class="text-sm hover:bg-gray-200/50 p-1 active:bg-gray-500/20 rounded-sm"
                  type="button"
                  @click="$socket.emit('get_position'); fetchUser()"
                >
                  Refresh
                </button>
              </label>
            </div>
            <div class="inverted field">
              <div class="ui large left inverted input">
                <input
                  v-model="teamName"
                  type="text"
                  placeholder="Name of Zone"
                />
              </div>
            </div>
            <div class="inverted field" style="text-align: center">
              <label style="color: white">
                A zone cost you a fee of 111°
              </label>
            </div>
          </form>
        </div>
        <div
          class="actions"
          style="
            background: #06051b;
            border-top: 1px solid rgba(34, 36, 38, 0.85);
            color: #fff;
          "
        >
          <div
            class="ui red left floated inverted button"
            @click="newTeamModal = false"
          >
            Cancel
          </div>
          <div
            class="ui green inverted button"
            @click="
              $socket.emit('create_zone', teamName);
              newTeamModal = false;
              getZones();
            "
          >
            Buy (111°)
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="editTeamModal"
      class="ui dimmer modals page visible active overlay"
      style="display: flex !important"
      @click="editTeamModal = false"
    >
      <div
        class="ui mini inverted modal front visible active team-modal"
        style="display: block !important"
        @click.stop=""
      >
        <div class="content" style="background: none !important">
          <form class="ui inverted fonta form">
            <h1 class="ui yellow header" style="text-align: center">
              Edit Team
            </h1>
            <div class="field">
              <div class="ui error message">
                <div class="header">Error</div>
              </div>
            </div>
            <div class="inverted field">
              <div class="ui large left inverted input">
                <input
                  v-model="teamName"
                  type="text"
                  placeholder="Name of Team"
                />
              </div>
            </div>
            <div class="inverted field">
              <div class="ui inverted input">
                <!-- eslint-disable-next-line -->
                <textarea
                  style="font-size: 1.1em"
                  class="fonta"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
            <div class="inverted field" style="text-align: center">
              <label style="color: white">
                A team cost you a fee of 111°
              </label>
            </div>
          </form>
        </div>
        <div
          class="actions"
          style="
            background: #06051b;
            border-top: 1px solid rgba(34, 36, 38, 0.85);
            color: #fff;
          "
        >
          <div
            class="ui red left floated inverted button"
            @click="newTeamModal = false"
          >
            Cancel
          </div>
          <button class="ui green inverted button" @click="createTeam()">
            Create
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="teamModal"
      class="ui dimmer modals page visible active overlay"
      style="display: flex !important"
      @click="teamModal = false"
    >
      <div
        class="ui mini inverted modal front visible active team-modal"
        style="display: block !important"
        @click.stop=""
      >
        <div class="content" style="background: none !important">
          Hello World
        </div>
      </div>
    </div>
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      aria-haspopup=""
      style="position: fixed; width: 100%; z-index: 10;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important; overflow: visible;overflow-y: visible!important;"

    >
      <div class="ui fluid container item" style="border: none !important">
        <div class="ui form" style="width: 100%">
          <div class="ui big fluid transparent icon input">
            <a
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom left"
              :data-tooltip="
                isCurrentlyOnline ?  $store.state.currentTeam === item.slug ? 'Buy Zone' : 'Not your current team!' : 'Go Online to Buy Zone'
              "
              @click="
                isCurrentlyOnline
                  ? (newTeamModal = true)
                  : (newTeamModal = false)
              "
            >
              <i
                class="icon plus"
                style="
                  margin-top: 0.3em;
                  color: rgba(0, 0, 0, 0.34);
                  margin-right: 0.5em;
                "
              />
            </a>
            <input
              v-model="search"
              style="
                text-align: center;
                color: #ffffff !important;
                padding: 0px;
              "
              :placeholder="'Team Message' + ''"
              autocomplete="off"
            />
            <!--            <a-->
            <!--              :data-tooltip="!viewMode ? 'All Teams' : 'Own Teams'"-->
            <!--              style="cursor: pointer"-->
            <!--              data-inverted=""-->
            <!--              data-position="bottom right"-->
            <!--              @click="changeView"-->
            <!--            >-->
            <!--              <i-->
            <!--                :class="{-->
            <!--                  eye: true,-->
            <!--                  slash: viewMode === 1,-->
            <!--                  icon: true,-->
            <!--                  light: true-->
            <!--                }"-->
            <!--                style="margin-top: 0.3em; color: rgba(0, 0, 0, 0.34); margin-left: 0.5em;"-->
            <!--              />-->
            <!--            </a>-->
          </div>
        </div>
      </div>
    </div>
    <h1 class="ui header">{{ item.name }}</h1>
    <div class="pt-2 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300">
      Team Description
    </div>
    <h3 class="ui header">Members <button
      class="text-sm hover:bg-gray-200/50 p-1 active:bg-gray-500/20 rounded-sm"
      @click.stop="showRemoveButton = !showRemoveButton"
    >
      remove from team
    </button></h3>
    <div class="ui divided items">
      <span
        v-for="(member, i) in item.whitelist">
        <img
          :src="'https://minotar.net/avatar/' + member + '/32.png'"
          draggable="false"
          class="ui avatar image rounded-sm pr-2"
          style="border-radius: 1px!important; height: 35px; width: auto; margin-top: 0.15em;"
        >
        <a v-if="showRemoveButton && i !== 0" draggable="false" href="#" @click="$socket.emit('remove_from_team', member);">
          {{ member }}
            <span
              class="ui inverted basic red mini button"
            >REMOVE</span>
        </a>
      </span>
      <div class="pt-6 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300">
        Go to a users profile to add them to your <strong>current</strong> team
      </div>
    </div>

    <h3 class="ui header">Zones</h3>
    <div>
      <div
        class="ui relaxed inverted bordered list stackable"
        style="margin-top: 0.5em!important; padding-top: 0em!important;"
      >
        <div
          v-for="zone in zones"
          :key="zone.slug"
          class="bordered item noselect"
          style="height: 52px;"
        >
          <img
            :src="'https://minotar.net/avatar/' + zone.username + '/32.png'"
            draggable="false"
            class="ui avatar image pr-2"
            style="border-radius: 1px!important; height: 35px; width: auto; margin-top: 0.15em;"
          >
          <div class="content">
            <div class="description">
<!--              <span>{{ zone.leader }}'s</span>-->
            </div>
            <div class="header elipsis" style="max-width: 160px">
              {{ zone.name }}
            </div>
          </div>
          <div class="right floated content" style="margin-top: 0.30em;">
            <a draggable="false" href="#" @click="$socket.emit('tp_to_zone', zone.name);">
            <span
              class="ui mini inverted button green"
              :class="{'disabled':!isCurrentlyOnline}"
            >TP 3°</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-2 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300">
      On teleport you pay 3° to the zones owner
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  auth: false,
  data() {
    return {
      newTeamModal: false,
      editTeamModal: false,
      teamModal: false,
      viewMode: 0,
      item: {},
      zones: [],
      search: "",
      teamName: "",
      teamDescription: "",
      showRemoveButton: false
    }
  },
  mounted() {
    this.getTeam()
    this.getZones()
  },
  computed: {
    ...mapGetters(["isCurrentlyOnline"]),
  },
  watch: {
    newTeamModal(val) {
      if (val) {
        this.teamName = ""
        this.teamDescription = ""
        this.$socket.emit('get_position');
        this.fetchUser()
      }
    },
  },
  methods: {
    getTeam() {
      this.$axios.$get("/teams/" + this.$route.params.slug).then((response) => {
        this.item = response
        console.log(response)
      })
    },
    getZones() {
      this.$axios.$get("/zones/" + this.$route.params.slug).then((response) => {
        this.zones = response
        console.log(response)
      })
    },
    fetchUser() {
      setTimeout(() => {

        this.$auth.fetchUser()
      }, 1000)
    },
    changeView() {
      this.viewMode === 0 ? (this.viewMode = 1) : (this.viewMode = 0)
    },
  },
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
