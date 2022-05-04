<template>
  <div
    class="ui inventory fluid padded"
    style="
      padding-top: 8em !important;
      padding-bottom: 8em !important;
      padding-left: 2em;
      padding-right: 2em;
    "
  >
    <div v-if="false" class="overlay">
      <div class="center">
        <div style="min-width: 300px">
          <h3 class="ui white header">
            <span
              style="
                background: rgba(204, 204, 204, 0.09);
                padding-left: 0.3em;
                padding-right: 0.2em;
              "
            >
              FORUM IS UNAVAILABLE.</span
            >
          </h3>
          <p>THE FORUM IS UNDER DEVELOPMENT.</p>
          <p>THANK YOU FOR UNDERSTANDING.</p>
        </div>
      </div>
    </div>
    <div
      v-if="newTeamModal"
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
          <form class="ui inverted fonta form" @submit.prevent="createBook()">
            <h1 class="ui yellow header" style="text-align: center">
              New Book
            </h1>
            <div class="field">
              <div class="ui error message">
                <div class="header">Error</div>
              </div>
            </div>
            <div class="inverted field">
              <div class="ui large left inverted input">
                <input v-model="bookName" type="text" placeholder="Book Name" />
              </div>
            </div>
            <div class="inverted field">
              <div class="ui inverted input">
                <!-- eslint-disable-next-line -->
                <textarea
                  v-model="bookContent"
                  style="font-size: 1.1em"
                  class="fonta"
                  placeholder="Content"
                ></textarea>
              </div>
            </div>
            <!--            <div class="inverted field" style="text-align: center">-->
            <!--              <label style="color: white">-->
            <!--                A team cost you a fee of 111°-->
            <!--              </label>-->
            <!--            </div>-->
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
            class="ui left floated inverted button"
            @click="newTeamModal = false"
          >
            Close
          </div>
          <button
            type="submit"
            class="ui green inverted button"
            @click="createBook()"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      style="position: fixed; width: 100%; z-index: 100;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important;overflow: visible;overflow-y: visible!important;"
    >
      <div class="ui fluid container item" style="border: none !important">
        <div class="ui form" style="width: 100%">
          <div class="ui big fluid transparent icon input">
            <a
              v-if="$auth.loggedIn"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom left"
              :data-tooltip="'Create a new book'"
              @click="newTeamModal = true"
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
              placeholder="Search"
              disabled
              autocomplete="off"
            />
            <i
              v-if="search.length > 0"
              class="remove link icon"
              style="
                color: rgba(0, 0, 0, 0.34);
                margin-right: 4.1em;
                margin-top: 0.1em;
              "
              @click="search = ''"
            />
            <a
              :data-tooltip="!viewMode ? 'All Books' : 'Own Books'"
              style="cursor: pointer"
              disabled
              class="disabled"
              data-inverted=""
              data-position="bottom right"
              @click="changeView"
            >
              <i
                :class="{
                  eye: true,
                  slash: viewMode === 1,
                  icon: true,
                  light: true,
                }"
                style="
                  margin-top: 0.3em;
                  color: rgba(0, 0, 0, 0.34);
                  margin-left: 0.5em;
                "
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="p-2 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300"
    >
      Buy books to support the authors.
    </div>
    <transition-group
      mode="out-in"
      tag="div"
      class="ui relaxed selection inverted bordered list stackable"
      style="margin-top: 0.5em !important; padding-top: 0em !important"
      name="fadeDown"
      appear
    >
      <nuxt-link
        v-for="item in items"
        :key="item.id"
        :to="'/book/' + item.id"
        class="bordered item noselect"
        style="height: 52px"
      >
        <img
          :src="'https://minotar.net/avatar/' + item.username + '/32.png'"
          draggable="false"
          class="ui avatar image pr-2"
          style="
            border-radius: 1px !important;
            height: 35px;
            width: auto;
            margin-top: 0.15em;
          "
        />
        <div class="content">
          <div class="description">
            <span>{{ item.username }}'s</span>
          </div>
          <div class="header elipsis" style="max-width: 160px">
            {{ item.title }}
          </div>
        </div>
        <div class="right floated content" style="margin-top: 0.3em">
          <span class="ui inverted basic label blue">Buy</span>
        </div>
      </nuxt-link>
    </transition-group>
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
      items: [],
      search: "",
      bookName: "",
      bookContent: "",
    }
  },
  mounted() {
    this.getTeams()
  },
  computed: {
    ...mapGetters(["isCurrentlyOnline", "currentTeam"]),
  },
  watch: {
    currentTeam() {
      this.getTeams()
    },
  },
  methods: {
    createBook() {
      this.$axios
        .$post("/books/", JSON.stringify({
            title: this.bookName,
            content: this.bookContent,
            username: this.$store.state.username,
          }),
          {headers:{'Content-Type': 'application/x-www-form-urlencoded'}} )
        .then(() => {
          this.newTeamModal = false
          this.bookName = ""
          this.bookContent = ""
        }).catch(() => {
          this.newTeamModal = false
          this.bookName = ""
          this.bookContent = ""
        })
    },
    getTeams() {
      this.items = []
      this.$axios.$get("/books").then((response) => {
        this.items = response
        console.log(response)
      })
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
