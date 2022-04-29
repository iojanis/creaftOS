<template>
  <div class="ui inventory container padded" style="padding-top: 7.5em!important; padding-bottom: 7em!important;">
    <div class="overlay">
      <div class="center">
        <div style="min-width: 300px;">
          <h3 class="ui white header">
            <span style="background: rgba(204,204,204,0.09); padding-left: 0.3em; padding-right: 0.2em"> BANK IS UNAVAILABLE.</span>
          </h3>
          <p>BANKING IS UNDER DEVELOPMENT.</p>
          <p>THANK YOU FOR UNDERSTANDING.</p>
        </div>
      </div>
    </div>
    <div
      class="ui top horizontal fixed inverted labeled sidebar overlay visible menu boldcraft second blurred"
      style="position: fixed; width: 100%; z-index: 10;top: 3.4em!important; border-bottom: rgba(255, 255, 255, 0.07) 2px solid!important; overflow: visible;overflow-y: visible!important;"
    >
      <div class="ui container item" style="border: none!important; ">
        <div class="ui form" style="width: 100%;">
          <div class="ui big fluid transparent icon input">
            <a data-tooltip="Transfer XP" style="cursor: pointer" data-inverted="" data-position="bottom left">
              <i
                class="plus icon light"
                style="margin-top: 0em; color: rgba(0, 0, 0, 0.34); margin-right: 0.5em; display: none;"
              />
            </a>
            <input v-model="search" style="text-align: center; color: #ffffff!important;padding: 0px" placeholder="Search" autocomplete="off">
            <i
              v-if="search.length > 0"
              class="remove link icon"
              style="color: rgba(0, 0, 0, 0.34); margin-right: 2.1em; margin-top: 0.15em;"
              @click="search = ''"
            />
            <a data-tooltip="Transfer XP" style="cursor: pointer" data-inverted="" data-position="bottom right">
              <i
                class="exchange icon light"
                style="margin-top: 0.3em; color: rgba(0, 0, 0, 0.34); margin-right: 0.5em;"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <transition
      v-if="false"
      name="fadeDown"
      appear
    >
      <div class="bitcoin-price">
        <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="btcFill" x1="1" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#f69119" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
        <TrendChart
          v-if="dataset.length"
          :datasets="[{data: dataset, fill: true, className: 'curve-btc'}]"
          :labels="labels"
          :min="0"
          :grid="grid"
        />
      </div>
    </transition>

    <transition-group
      v-if="false"
      mode="out-in"
      tag="div"
      class="ui relaxed inverted bordered list stackable two column grid"
      style="margin-top: 0.5em!important; padding-top: 0em!important;"
      name="fadeDown"
      appear
    >
      <div
        v-for="item in items"
        :key="item.type"
        class="bordered column item noselect"
        style="height: 52px;"
      >
        <img
          :src="'https://minotar.net/avatar/rgby'"
          draggable="false"
          class="ui avatar image"
          style="border-radius: 3px!important; height: 35px; width: auto; margin-top: 0.15em;"
        >
        <img
          :src="'/mcicons/'+item.type+'-'+item.meta+'.png'"
          draggable="false"
          class="ui avatar image"
          style="margin-top: -1px; height: 42px; width: auto; border-radius: 3px!important;"
        >
        <div class="content">
          <div class="description">
            <span>{{ new Date().toDateString() }}</span>
          </div>
          <div class="header elipsis" style="max-width: 140px">
            {{ item.name }}
          </div>
          <div class="header" style="height: 0px!important;">
            <div style="float: left;position: relative; bottom: 5px; left: -60px; text-shadow: 2px 2px #000000, -2px -2px #000000; text-align: right!important;" class="">
              -{{ Math.floor(Math.random() * 1000) }}
            </div>
          </div>
        </div>
        <div class="right floated content" style="margin-top: 0.4em;">
          <span draggable="false" class="ui inverted basic label green">+{{ Math.floor(Math.random() * 1444) }}°</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import TrendChart from 'vue-trend-chart'

export default {
  components: {
    TrendChart
  },
  auth: false,
  data () {
    return {
      dataset: [],
      labels: {
        xLabels: [],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100 + '°'
      },
      grid: {
        verticalLines: true,
        verticalLinesNumber: 1,
        horizontalLines: true,
        horizontalLinesNumber: 1
      },
      transferDirection: 0,
      transferRate: 3,
      manageMode: 1,
      viewMode: 0,
      items: [
        {
          type: 3,
          meta: 0,
          name: 'Dirt',
          text_type: 'dirt'
        },
        {
          type: 3,
          meta: 1,
          name: 'Coarse Dirt',
          text_type: 'dirt'
        },
        {
          type: 3,
          meta: 2,
          name: 'Podzol',
          text_type: 'dirt'
        },
        {
          type: 4,
          meta: 0,
          name: 'Cobblestone',
          text_type: 'cobblestone'
        },
        {
          type: 5,
          meta: 0,
          name: 'Oak Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 1,
          name: 'Spruce Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 2,
          name: 'Birch Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 3,
          name: 'Jungle Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 4,
          name: 'Acacia Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 5,
          name: 'Dark Oak Wood Plank',
          text_type: 'planks'
        },
        {
          type: 1,
          meta: 0,
          name: 'Stone',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 1,
          name: 'Granite',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 2,
          name: 'Polished Granite',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 3,
          name: 'Diorite',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 4,
          name: 'Polished Diorite',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 5,
          name: 'Andesite',
          text_type: 'stone'
        },
        {
          type: 1,
          meta: 6,
          name: 'Polished Andesite',
          text_type: 'stone'
        },
        {
          type: 2,
          meta: 0,
          name: 'Grass',
          text_type: 'grass'
        },
        {
          type: 3,
          meta: 0,
          name: 'Dirt',
          text_type: 'dirt'
        },
        {
          type: 3,
          meta: 1,
          name: 'Coarse Dirt',
          text_type: 'dirt'
        },
        {
          type: 3,
          meta: 2,
          name: 'Podzol',
          text_type: 'dirt'
        },
        {
          type: 4,
          meta: 0,
          name: 'Cobblestone',
          text_type: 'cobblestone'
        },
        {
          type: 5,
          meta: 0,
          name: 'Oak Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 1,
          name: 'Spruce Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 2,
          name: 'Birch Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 3,
          name: 'Jungle Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 4,
          name: 'Acacia Wood Plank',
          text_type: 'planks'
        },
        {
          type: 5,
          meta: 5,
          name: 'Dark Oak Wood Plank',
          text_type: 'planks'
        }
      ],
      search: ''
    }
  },
  mounted () {
    const data = {
      '2019-01-01': 869.47,
      '2019-01-02': 941.2167,
      '2019-01-03': 832.155,
      '2019-01-04': 863.6267,
      '2019-01-05': 835.5983,
      '2019-01-06': 483.165,
      '2019-01-07': 441.4583,
      '2019-01-08': 429.9917,
      '2019-01-09': 428.2917,
      '2019-01-10': 669.5825,
      '2019-01-11': 660.9583,
      '2019-01-12': 658.6725,
      '2019-01-13': 540.1583,
      '2019-01-14': 706.1725,
      '2019-01-15': 604.1333,
      '2019-01-16': 630.2567,
      '2019-01-17': 665.41,
      '2019-01-18': 630.785,
      '2019-01-19': 708.9633,
      '2019-01-20': 552.8933,
      '2019-01-21': 548.69,
      '2019-01-22': 598.2183,
      '2019-01-23': 576.01,
      '2019-01-24': 598.2717,
      '2019-01-25': 582.2,
      '2019-01-26': 580.775,
      '2019-01-27': 553.0133,
      '2019-01-28': 454.48,
      '2019-01-29': 421.12,
      '2019-01-30': 482.3,
      '2019-01-31': 441.985
    }
    for (const key in data) {
      this.dataset.push(data[key])
      this.labels.xLabels.push(key)
    }
  },
  methods: {
    downloadItem (item, amount) {
      this.$socket.emit('download-item', item, amount)
    },
    changeTransferRate () {
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
    transferRateText () {
      switch (this.transferRate) {
        case 0:
          return '1 Item'
        case 1:
          return '16 Items'
        case 2:
          return '32 Items'
        case 3:
          return '64 Items'
      }
    },
    changeTransferDirection () {
      this.transferDirection === 0
        ? (this.transferDirection = 1)
        : (this.transferDirection = 0)
    },
    changeView () {
      this.viewMode === 0 ? (this.viewMode = 1) : (this.viewMode = 0)
    },
    changeManage () {
      this.manageMode === 0 ? (this.manageMode = 1) : (this.manageMode = 0)
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
.ui.grid>.column:not(.row) {
    padding-top: 0.5rem;
    padding-bottom: 1rem;
}
.bitcoin-price {
     padding: 0.5em;
 }
.bitcoin-price .vtc {
     height: 150px;
     font-size: 12px;
}
@media (min-width: 699px) {
    .bitcoin-price .vtc {
        height: 250px;
    }
}
.bitcoin-price .grid line, .bitcoin-price .labels line {
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
.bitcoin-price .x-labels .label:nth-child(10n + 1) text, .bitcoin-price .x-labels .label:first-child text {
    display: block;
    fill: #ffffff;
}
.bitcoin-price .x-labels .label:nth-child(10n + 1) line, .bitcoin-price .x-labels .label:first-child line {
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
