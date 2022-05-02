<template>
  <div
    class="ui inventory fluid padded"
    style="
      padding-top: 8em !important;
      padding-bottom: 8em !important;
      padding-left: 1em;
      padding-right: 1em;
    "
  >
    <div
      v-if="offerModal"
      class="ui dimmer modals page visible active overlay"
      style="display: flex !important"
      @click="offerModal = false"
    >
      <div
        class="ui inverted longer modal front visible active price-modal"
        style="display: block !important"
        @click.stop=""
      >
        <div class="scrolling content" style="background: none !important">
          <!--          <img-->
          <!--            :src="'/mcicons/152-0.png'"-->
          <!--            draggable="false"-->
          <!--            class="ui avatar image"-->
          <!--            style="height: 42px; width: auto; border-radius: 3px!important; float: left;"-->
          <!--          >-->
          <!--          <h3 class="ui white header">-->
          <!--            <span-->
          <!--              style="background: #cccccc; padding-left: 0.3em; padding-right: 0.2em"-->
          <!--            >-->
          <!--              STATISTICS ARE UNAVAILABLE.</span-->
          <!--              >-->
          <!--          </h3>-->
          <div
            v-if="
              currentMarketItemStats &&
              currentMarketItemStats.dataset2 &&
              currentMarketItemStats.dataset2.length > 1
            "
            class="bitcoin-price"
          >
            <svg
              style="width: 0; height: 0; position: absolute"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="btcFill" x1="1" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#f69119" />
                  <stop offset="100%" stop-color="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            <h3 class="ui white header">
              <span
                style="
                  background: rgba(204, 204, 204, 0.12);
                  padding-left: 0.3em;
                  padding-right: 0.2em;
                "
              >
                PRICE PER ITEM</span
              >
            </h3>
            <TrendChart
              :datasets="[
                {
                  data: currentMarketItemStats.dataset,
                  fill: true,
                  smooth: false,
                  showPoints: false,
                  className: 'curve-btc',
                },
              ]"
              :labels="currentMarketItemStats.labels"
              :min="0"
              :grid="grid"
            />
            <h3 class="ui white header">
              <span
                style="
                  background: rgba(204, 204, 204, 0.12);
                  padding-left: 0.3em;
                  padding-right: 0.2em;
                "
              >
                VOLUME (AMOUNT * PRICE)</span
              >
            </h3>
            <TrendChart
              :datasets="[
                {
                  data: currentMarketItemStats.dataset2,
                  fill: true,
                  smooth: false,
                  showPoints: false,
                  className: 'curve-btc',
                },
              ]"
              :labels="currentMarketItemStats.labels2"
              :min="0"
              :grid="grid"
            />
          </div>
          <h3 v-else class="ui white header">
            <span
              class="m-auto relative"
              style="
                background: rgba(204, 204, 204, 0.12);
                padding-left: 0.3em;
                padding-right: 0.2em;
              "
            >
              NO DATA YET</span
            >
          </h3>
          <transition-group
            mode="out-in"
            tag="div"
            class="ui relaxed selection inverted bordered list stackable one column grid"
            style="margin-top: 0.5em !important; padding-top: 0em !important"
            name="fadeDown"
            appear
          >
            <div
              v-for="item in items"
              :key="item.type"
              class="bordered column item noselect"
              style="height: 52px"
              @click="offerModal = true"
            >
              <img
                :src="'https://minotar.net/avatar/rgby'"
                draggable="false"
                class="ui avatar image"
                style="
                  border-radius: 3px !important;
                  height: 35px;
                  width: auto;
                  margin-top: 0.15em;
                "
              />
              <img
                :src="'/mcicons/' + item.type + '-' + item.meta + '.png'"
                draggable="false"
                class="ui avatar image"
                style="
                  margin-top: -1px;
                  height: 42px;
                  width: auto;
                  border-radius: 3px !important;
                "
              />
              <div class="content">
                <div class="description">
                  <span>rgby's</span>
                </div>
                <div class="header elipsis" style="max-width: 160px">
                  {{ item.name }}
                </div>
                <div class="header" style="height: 0px !important">
                  <div
                    style="
                      float: left;
                      position: relative;
                      bottom: 5px;
                      left: -60px;
                      text-shadow: 2px 2px #000000, -2px -2px #000000;
                      text-align: right !important;
                    "
                    class=""
                  >
                    {{ Math.floor(Math.random() * 1000) }}
                  </div>
                </div>
              </div>
              <div class="right floated content" style="margin-top: 0.4em">
                <a draggable="false" href="#" @click.stop="">
                  <a class="ui inverted basic label green"
                    >{{ Math.floor(Math.random() * 1444) }}°</a
                  >
                </a>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
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
      <div class="ui fluid container item" style="border: none !important">
        <div class="ui form" style="width: 100%">
          <div class="ui big fluid transparent icon input">
            <a
              :data-tooltip="transferDirection ? 'Most Items' : 'Least Items'"
              data-inverted=""
              data-position="bottom left"
              style="cursor: pointer"
              @click="changeTransferDirection"
            >
              <i
                :class="{
                  sort: true,
                  size: true,
                  up: transferDirection === 0,
                  down: transferDirection === 1,
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
            <a
              :data-tooltip="transferRateText()"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom left"
              @click="changeTransferRate"
            >
              <i
                :class="{
                  disabled: manageMode === 0,
                  signal: true,
                  one: transferRate === 0,
                  two: transferRate === 1,
                  three: transferRate === 2,
                  four: transferRate === 3,
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
              :data-tooltip="!manageMode ? 'Sell' : 'Manage'"
              style="opacity: 0"
              data-inverted=""
              data-position="bottom right"
            >
              <i
                :class="{
                  mouse: true,
                  coin: manageMode === 0,
                  pointer: manageMode === 1,
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
    <transition-group
      mode="out-in"
      tag="div"
      class="ui relaxed selection inverted bordered list stackable two column grid"
      style="margin-top: 0.5em !important; padding-top: 0em !important"
      name="fadeDown"
      appear
    >
      <div
        v-for="item in filteredMarketItems"
        v-if="item.amount > 0 && item.market"
        :key="item.id"
        class="bordered column item noselect"
        style="height: 52px"
        @click="showStatsFor(item.item)"
      >
        <img
          :src="'https://minotar.net/avatar/' + item.username"
          draggable="false"
          class="ui avatar image"
          style="
            border-radius: 3px !important;
            height: 35px;
            width: auto;
            margin-top: 0.15em;
          "
        />
        <img
          :src="'/mcimages/' + item.item + '.png'"
          draggable="false"
          class="ui avatar image"
          style="
            margin-top: -1px;
            height: 42px;
            width: 42px;
            border-radius: 3px !important;
          "
        />
        <div class="content">
          <div class="description">
            <span>{{ item.username }}'s</span>
          </div>
          <div class="header elipsis" style="max-width: 130px">
            {{ item.name }}
          </div>
          <div class="header" style="height: 0px !important">
            <div
              style="
                float: left;
                position: relative;
                bottom: 5px;
                left: -60px;
                text-shadow: 2px 2px #000000, -2px -2px #000000;
                text-align: right !important;
              "
              class=""
            >
              {{ item.amount }}
            </div>
          </div>
        </div>
        <div class="right floated content" style="margin-top: 0.4em">
          <a draggable="false" @click.stop="">
            <a
              v-if="$store.state.username != item.username"
              :data-tooltip="`Buy ${transferRateNumber()} for ${
                item.price * transferRateNumber()
              }°`"
              class="ui inverted basic label green"
              data-inverted=""
              data-position="left center"
              @click="
                buyMarketItemHere(
                  item.username,
                  item.item,
                  transferRateNumber(),
                  item.price
                )
              "
              >{{ item.price * transferRateNumber() }}°</a
            >
            <a
              v-else
              data-inverted=""
              data-position="left center"
              data-tooltip="Remove offer"
              class="ui compact inverted tiny basic red button"
              style="padding: 0.8em"
              @click="removeOffer(item.item)"
            >
              {{ item.price * transferRateNumber() }}°
            </a>
          </a>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import TrendChart from "vue-trend-chart";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    TrendChart,
  },
  auth: false,
  data() {
    return {
      dataset: [
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
        "0.2",
      ],
      labels: {
        xLabels: [
          "2022-03-21T21:27:51.754Z",
          "2022-03-21T21:27:54.569Z",
          "2022-03-21T21:27:55.309Z",
          "2022-03-21T21:27:55.764Z",
          "2022-03-21T21:27:56.052Z",
          "2022-03-21T21:27:56.262Z",
          "2022-03-21T21:27:56.468Z",
          "2022-03-21T21:27:56.688Z",
          "2022-03-21T21:27:56.919Z",
          "2022-03-21T21:27:57.119Z",
          "2022-03-21T21:27:57.339Z",
          "2022-03-21T21:27:57.548Z",
          "2022-03-21T21:27:57.760Z",
          "2022-03-21T21:27:57.979Z",
          "2022-03-21T21:27:58.170Z",
          "2022-03-21T21:27:58.363Z",
          "2022-03-21T21:27:58.565Z",
          "2022-03-21T21:27:58.751Z",
          "2022-03-21T21:27:58.947Z",
          "2022-03-21T21:27:59.165Z",
          "2022-03-21T21:27:59.342Z",
          "2022-03-21T21:27:59.536Z",
          "2022-03-21T21:27:59.710Z",
        ],
        yLabels: 5,
        yLabelsTextFormatter: (val) => Math.round(val * 100) / 100 + "°",
      },
      grid: {
        verticalLines: true,
        verticalLinesNumber: 10,
        horizontalLines: true,
        horizontalLinesNumber: 5,
      },
      transferDirection: 0,
      transferRate: 3,
      manageMode: 1,
      viewMode: 0,
      offerModal: false,
      items: undefined,
      search: "",
    };
  },
  computed: {
    ...mapGetters(["currentMarketItems", "currentMarketItemStats"]),
    offerItem() {
      return true;
    },
    filteredMarketItems() {
      let filter = false;
      let sort;
      if (this.search.length > 2) {
        filter = (item) => item.name.includes(this.search);
      } else if (this.viewMode === 1) {
        filter = (item) =>
          item.username === this.$store.state.auth.user.username;
      } else {
        filter = (item) => item.amount > 1;
      }
      if (this.transferDirection === 1) {
        sort = (a, b) => b.amount - a.amount && b.price - a.price;
      } else {
        sort = (a, b) => a.amount - b.amount && a.price - b.price;
      }
      return this.currentMarketItems.filter(filter).sort(sort);
    },
  },
  mounted() {
    if (this.currentMarketItems.length < 1) {
      this.$store.watch(
        (state) => {
          try {
            if (state.auth.user.username) {
              if (state.isOnline) {
                this.manageMode = 0;
              }
            }
          } catch (e) {
            console.log(e);
          }
        },
        (val) => {},
        { deep: true }
      );
    }
  },
  methods: {
    ...mapActions(["getMarketItems", "getMarketItemStats", "buyItem"]),
    buyMarketItemHere(item, seller, amount, price) {
      const options = {
        item,
        seller,
        amount,
        price,
      };
      this.buyItem(options);
    },
    showStatsFor(item) {
      this.offerModal = true;
      this.$socket.emit("get_market_item_stats_by", item);
    },
    removeOffer(item) {
      this.$socket.emit("set_market_item", item, null);
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
    transferRateNumber() {
      switch (this.transferRate) {
        case 0:
          return 1;
        case 1:
          return 16;
        case 2:
          return 32;
        case 3:
          return 64;
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
.bitcoin-price {
  padding: 0.1em;
}
.bitcoin-price .vtc {
  height: 75px;
  font-size: 12px;
}
@media (min-width: 699px) {
  .bitcoin-price .vtc {
    height: 160px;
  }
}
.bitcoin-price .grid line,
.bitcoin-price .labels line {
  stroke: #257f35;
}
.bitcoin-price .y-labels .label text {
  fill: #ffffff;
}
.bitcoin-price .x-labels .label text {
  display: none;
  fill: #ffffff;
}
.bitcoin-price .x-labels .label line {
  opacity: 0.3;
  fill: #ffffff;
}
.bitcoin-price .x-labels .label:nth-child(10n + 1) text,
.bitcoin-price .x-labels .label:first-child text {
  display: block;
  fill: #ffffff;
}
.bitcoin-price .x-labels .label:nth-child(10n + 1) line,
.bitcoin-price .x-labels .label:first-child line {
  opacity: 1;
  fill: #ffffff;
}
.bitcoin-price .curve-btc .stroke {
  stroke: #2ecc40;
  stroke-width: 2;
}
.bitcoin-price .curve-btc .fill {
  fill: rgba(46, 204, 64, 0.52);
  fill-opacity: 0.5;
}
</style>
