<template>
  <div
    class="ui inventory container padded"
    style="padding-top: 4.5em !important; padding-bottom: 7em !important"
  >
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      style="
        position: fixed;
        width: 100%;
        z-index: 10;
        top: 3.4em !important;
        border-bottom: rgba(255, 255, 255, 0.07) 2px solid !important;
        overflow: visible;
        overflow-y: visible !important;
      "
    >
      <div class="ui container item" style="border: none !important">
        <div class="ui form" style="width: 100%">
          <div class="ui big fluid transparent icon input">
            <a
              :data-tooltip="'Add to Whitelist'"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom left"
              @click="$socket.emit('add_to_team', $route.params.username)"
            >
              <i
                :class="{
                  disabled: manageMode === 0,
                  'plus': true,
                  icon: true,
                  light: true,
                }"
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
              :data-tooltip="!viewMode ? 'All Offers' : 'Own Offers'"
              style="cursor: pointer"
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
    <div class="pt-32 text-center">
      <h3 class="ui white header">
        <span
          class="uppercase"
          style="
            background: rgba(204, 204, 204, 0.09);
            padding-left: 0.3em;
            padding-right: 0.2em;
          "
          >Whois {{ $route.params.username }}</span
        >
      </h3>
      <img
        class="mx-auto"
        :src="'https://minotar.net/body/' + $route.params.username + '.png'"
      />
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      transferDirection: 0,
      transferRate: 3,
      manageMode: 1,
      viewMode: 0,
      items: [],
      search: "",
    };
  },
  methods: {
    downloadItem(item, amount) {
      this.$socket.emit("download-item", item, amount);
    },
    changeTransferRate() {
      switch (this.transferRate) {
        case 0:
          this.transferRate = 1;
          break;
        case 1:
          this.transferRate = 2;
          break;
        case 2:
          this.transferRate = 3;
          break;
        case 3:
          this.transferRate = 0;
          break;
      }
    },
    transferRateText() {
      switch (this.transferRate) {
        case 0:
          return "1 Item";
        case 1:
          return "16 Items";
        case 2:
          return "32 Items";
        case 3:
          return "64 Items";
      }
    },
    changeTransferDirection() {
      this.transferDirection === 0
        ? (this.transferDirection = 1)
        : (this.transferDirection = 0);
    },
    changeView() {
      this.viewMode === 0 ? (this.viewMode = 1) : (this.viewMode = 0);
    },
    changeManage() {
      this.manageMode === 0 ? (this.manageMode = 1) : (this.manageMode = 0);
    },
  },
};
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
</style>
