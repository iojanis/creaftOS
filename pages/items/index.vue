<template>
  <div
    class="ui inventory fluid container padded pt-32 pb-64"
    style="padding-left: 2em; padding-right: 2em"
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
      <div class="ui fluid container item" style="border: none !important">
        <div class="ui form" style="width: 100%">
          <div class="ui big fluid transparent icon input">
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
                margin-top: 0.15em;
              "
              @click="search = ''"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="ui relaxed selection inverted bordered list stackable item">
      <a
        v-for="item in items"
        :key="item._id"
        :data="item"
        draggable="false"
        class="bordered item noselect"
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
        <div class="content">
          <div class="description">
            <span>{{ item.item }}</span>
          </div>
          <div class="header">
            {{ item.name }}
          </div>
        </div>

        <div class="right floated content">
          <div class="ui inverted input">
            <input v-model="item.item" placeholder="item id" />
          </div>
          <div class="ui inverted input">
            <input v-model="item.name" placeholder="item name" />
          </div>

          <a draggable="false" href="#" @click="updateItem(i, item)">
            <span class="ui inverted basic label blue">UPDATE</span>
          </a>
          <a draggable="false" href="#" @click="deleteItem(item)">
            <span class="ui inverted basic label red">DELETE</span>
          </a>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  auth: false,
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
    }
  },
  computed: {
    ...mapGetters(["currentItems"]),
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
    this.$axios.$get("/data?limit=1150").then((response) => {
      this.items = response
    })
  },
  methods: {
    updateItem(i, item) {
      this.$socket.emit("update_item", {
        item,
      })
    },
    deleteItem() {
      this.$socket.emit("delete_item", this.item)
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
</style>
