<template>
  <div
    class="ui inventory padded pt-32 pb-96"
    style="padding-left: 1em; padding-right: 1em"
  >
    <div
      v-if="offerModal"
      class="ui dimmer modals page visible active overlay"
      style="display: flex !important"
      @click="offerModal = false"
    >
      <div
        class="ui inverted modal front visible active price-modal"
        style="display: block !important; max-width: 500px !important"
        @click.stop=""
      >
        <div class="content" style="background: none !important">
          <form class="ui inverted fonta form" @submit.prevent="submitOffer()">
            <img
              :src="'/mcimages/' + selectedOffer.item + '.png'"
              draggable="false"
              class="ui avatar image"
              style="
                margin-top: -1px;
                height: 42px;
                width: auto;
                border-radius: 3px !important;
              "
            />
            <span class="ui inverted header fonta overflow-hidden w-full overflow-ellipsis"
              >{{ selectedOffer.name }}
<!--              <a-->
<!--                v-if="-->
<!--                currentMarketItemStats &&-->
<!--                currentMarketItemStats.dataset2 &&-->
<!--                currentMarketItemStats.dataset2.length > 1-->
<!--              "-->
<!--                class="text-sm p-3 py-1 rounded-sm bg-gray-500/20"-->
<!--                @click="-->
<!--                  $socket.emit('get_market_item_stats_by', selectedOffer.item)-->
<!--                "-->
<!--                >Hide Stats</a-->
<!--              >-->
            </span
            >
            <div
              v-if="
                currentMarketItemStats &&
                currentMarketItemStats.dataset2 &&
                currentMarketItemStats.dataset2.length > 1
              " class="bitcoin-price">
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
            </div>
            <div class="field">
              <div
                class="ui fluid inverted transparent labeled input inverted basic label"
                style="padding: 0px; margin-top: 1em; margin-bottom: 1em"
              >
                <label for="amount" style="padding: 1em">PRICE PER ITEM</label>
                <input
                  id="amount"
                  ref="amount"
                  v-model="amount"
                  autofocus
                  step=".01"
                  min="0"
                  type="number"
                  placeholder="Amount"
                />
              </div>
            </div>
            <div class="field">
              <div
                class="ui fluid inverted transparent labeled input inverted basic label"
                style="padding: 0px; margin-top: 1em; margin-bottom: 1em"
              >
                <label for="amount" style="padding: 1em">MINIMUM STOCK</label>
                <input
                  id="limit"
                  ref="limit"
                  v-model="limit"
                  :placeholder="
                    'Limit (' + selectedOffer.amount + ' available)'
                  "
                  autofocus
                  step=".01"
                  min="0"
                  type="number"
                />
              </div>
            </div>
            <div v-if="amount <= 99"  class="ui three mini inverted fonta statistics">
              <div class="statistic fonta">
                <div class="value fonta">
                  {{ parseFloat(amount * 16).toFixed(2) }}
                </div>
                <div class="label fonta">1/4</div>
              </div>
              <div class="statistic fonta">
                <div class="value fonta">
                  {{ parseFloat(amount * 32).toFixed(2) }}
                </div>
                <div class="label fonta">1/2</div>
              </div>
              <div   class="statistic fonta">
                <div class="value fonta">
                  {{ parseFloat(amount * 64).toFixed(2) }}
                </div>
                <div class="label fonta">Stack</div>
              </div>
            </div>
            <div v-else class="ui one mini inverted fonta centered statistics">
              <div   class="statistic fonta">
                <div class="value fonta">
                  {{ parseFloat(amount * 1).toFixed(2) }}
                </div>
                <div class="label fonta">Single Item Price</div>
              </div>
            </div>
          </form>
        </div>
        <div
          class="actions"
          style="
            qabackground: #06051b;
            border-top: 1px solid rgba(34, 36, 38, 0.85);
            color: #fff;
          "
        >
          <div
            class="ui left floated inverted button"
            @click="offerModal = false"
          >
            Close
          </div>
          <div class="ui red inverted button" @click="removeOffer()">
            Remove
          </div>
          <div class="ui green inverted button" @click="submitOffer()">Set</div>
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
              :data-tooltip="transferDirection ? 'Download' : 'Upload'"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom left"
              @click="changeTransferDirection"
            >
              <i
                :class="{
                  disabled: manageMode === 0,
                  arrow: true,
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
              :placeholder="computedPlaceholder"
              autocomplete="off"
            />
            <i
              v-if="search.length > 0"
              class="remove link icon"
              style="
                color: rgba(0, 0, 0, 0.34);
                margin-right: 4.1em;
                margin-top: 0.15em;
              "
              @click="search = ''"
            />
            <a
              :data-tooltip="!manageMode ? 'Sell Mode' : 'Manage Mode'"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom right"
              @click="changeManage"
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
              :data-tooltip="!viewMode ? 'All Items' : 'Only in Stock'"
              style="cursor: pointer"
              data-inverted=""
              data-position="bottom right"
              @click="changeView"
            >
              <i
                :class="{
                  disabled: search.length > 2,
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

    <div class="h-full">
      <div
        class="relative ui relaxed selection inverted bordered list h-full"
        style="padding-bottom: 5em"
      >
        <a
          v-for="item in filteredItems"
          :key="item._id"
          :data="item"
          :class="{ market: item.market }"
          draggable="false"
          class="noselect item"
          style="
            float: left;
            padding: 0.5em;
            z-index: 90 !important;
            height: 55px;
            width: 55px;
          "
          @click="itemAction(item.item)"
        >
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
          <!--        <span class="floating ui inverted label inventory-item" style="z-index: 10!important;">1</span>-->
          <span
            style="
              position: relative;
              left: 20px;
              top: -10px;
              text-shadow: 2px 2px #000000, -2px -2px #000000;
              text-align: right !important;
            "
            >{{ item.amount }}</span
          >
          <!--        <span style="position: relative; left: 30px; top: -10px;background: #201c31!important;opacity: 0.95;border: 2px solid #4b4a5a!important;border-radius: 4px;padding: 2px;">{{ Math.floor(Math.random() * 63) }}</span>-->
        </a>
        <div
          v-if="filteredItems.length === 0"
          class="p-2 opacity-50 hover:opacity-100 transition-opacity tracking-wide duration-300"
        >
          No items uploaded yet? Go online, search for an Item and click on it
          to add it to your Stock. You can also see all items by clicking on the
          "All Items" (Eye) button.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrendChart from "vue-trend-chart"
import { mapActions, mapGetters } from "vuex"

export default {
  auth: false,
  components: {
    TrendChart,
  },
  data() {
    return {
      transferDirection: 0,
      transferRate: 3,
      manageMode: 0,
      viewMode: 1,
      offerModal: false,
      selectedOffer: undefined,
      items: [],
      search: "",
      amount: null,
      limit: null,
      grid: {
        verticalLines: true,
        verticalLinesNumber: 10,
        horizontalLines: true,
        horizontalLinesNumber: 5,
      },
    }
  },
  computed: {
    ...mapGetters(["currentItems", "currentMarketItemStats"]),
    computedPlaceholder() {
      if (this.viewMode === 1) {
        return "Search"
      } else {
        return "Search all " + this.filteredItems.length + " items"
      }
    },
    offerItem() {
      return true
    },
    filteredItems() {
      let filter = false
      if (this.search.length > 2) {
        filter = (item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase())
      } else if (this.viewMode === 1) {
        filter = (item) => item.amount > 0
      } else {
        filter = (item) => item
      }
      return this.currentItems.filter(filter)
    },
  },
  mounted() {
    if (this.currentItems.length < 1) {
      this.getStockItems(0)
    }
    if (this.$store.state.isOnline) {
      this.manageMode = 1
    }
  },

  methods: {
    ...mapActions(["getStockItems"]),
    itemAction(id) {
      let realRate
      switch (this.transferRate) {
        case 0:
          realRate = 1
          break
        case 1:
          realRate = 16
          break
        case 2:
          realRate = 32
          break
        case 3:
          realRate = 64
          break
      }
      if (this.manageMode === 1) {
        if (this.transferDirection === 0) {
          this.$socket.emit("upload_item", id, realRate)
        } else {
          this.$socket.emit("download_item", id, realRate)
        }
      } else {
        this.offerModal = true
        const index = this.currentItems.findIndex((x) => x.item === id)
        this.selectedOffer = this.currentItems[index]
        this.$socket.emit('get_market_item_stats_by', this.selectedOffer.item)
        this.amount = null
        this.limit = null
        this.$nextTick(() => {
          this.$refs.amount.focus()
        })
      }
    },
    removeOffer() {
      this.offerModal = false
      this.$socket.emit("set_market_item", this.selectedOffer.item, 0, 0)
    },
    submitOffer() {
      this.offerModal = false
      this.$socket.emit(
        "set_market_item",
        this.selectedOffer.item,
        this.amount,
        this.limit
      )
    },
    changeTransferRate() {
      switch (this.transferRate) {
        case 0:
          this.transferRate = 1
          break
        case 1:
          this.transferRate = 2
          break
        case 2:
          this.transferRate = 3
          break
        case 3:
          this.transferRate = 0
          break
      }
    },
    transferRateText() {
      switch (this.transferRate) {
        case 0:
          return "1 Item"
        case 1:
          return "16 Items"
        case 2:
          return "32 Items"
        case 3:
          return "64 Items"
      }
    },
    changeTransferDirection() {
      this.transferDirection === 0
        ? (this.transferDirection = 1)
        : (this.transferDirection = 0)
    },
    changeView() {
      this.viewMode === 0 ? (this.viewMode = 1) : (this.viewMode = 0)
    },
    changeManage() {
      if (this.$store.state.isOnline) {
        this.manageMode === 0 ? (this.manageMode = 1) : (this.manageMode = 0)
      } else {
        this.manageMode = 0
      }
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
.market {
  color: #2ecc40 !important;
}
.overlay {
  background-color: rgba(10, 10, 29, 0.76) !important;
}
.price-modal {
  background: rgba(3, 1, 25, 0.8) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
}
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
