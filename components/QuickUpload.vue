<template>
  <div
    v-if="$store.state.QuickUpload"
    style="z-index: 111"
    class="fixed left-0 right-0 top-0 bottom-0 h-screen w-screen pointer-events-none"
  >
    <div
      class="ui inventory fluid container padded pt-12 pb-64"
      style="padding-left: 2em; padding-right: 2em"
    >
      <div ref="el" :style="style" class="main1 pointer-events-auto">
        <h1>
          Quick*Upload
          <button
            class="text-sm hover:bg-gray-200/50 p-1 active:bg-gray-500/20 rounded-sm"
            @click="$socket.emit('get-inventory')"
          >
            Refresh
          </button>
          <button
            class="text-sm float-right mt-2 hover:bg-gray-200/50 p-1 active:bg-gray-100/20 rounded-sm"
            @click="toggleQuickUpload(false)"
          >
            Close
          </button>
        </h1>

        <div class="boxes2">
          <div
            v-for="item in invItems"
            :key="item.slot"
            class="box"
            @click="
              $socket.emit('upload_item', item.id, 1111);
              $socket.emit('get-inventory');
            "
          >
            <img
              :src="'/mcimages/' + item.id + '.png'"
              draggable="false"
              style=""
            />
            <span class="fixed -mt-6 mr-2 text-sm">{{ item.count }}</span>
          </div>
        </div>

        <div class="boxes3">
          <div
            v-for="item in hotBar"
            :key="item.slot"
            class="box"
            @click="
              $socket.emit('upload_item', item.id, 1111);
              $socket.emit('get-inventory');
            "
          >
            <img
              :src="'/mcimages/' + item.id + '.png'"
              draggable="false"
              style=""
            />
            <span class="fixed -mt-6 mr-2 text-sm">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import { ref } from '@vue/composition-api'

export default {
  name: "QuickUpload",
  // setup() {
  //   const el = ref(null)
  //   return {el}
  // },
  data() {
    return {};
  },
  watch: {
    visibleUpload () {
      this.getItems()
    }
  },
  computed: {
    ...mapGetters(["currentInventory"]),
    visibleUpload () {
      return this.$store.state.QuickUpload
    },
    normalizeInventory() {
      // get the inventory from the store
      let json;
      const slots = [];
      const inventory = this.currentInventory.toString();
      const strange = inventory
        .replace(/(\d+)[a-z]/gi, "$1")
        .replace(/minecraft:/gi, "")
        .replace(/'/g, "")
        .toLocaleLowerCase()
        .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');
      try {
        json = JSON.parse(strange);
        let didIt = false;
        for (let i = 0; i < 36; i++) {
          for (let j = 0; j < json.length; j++) {
            if (json[j].slot === i) {
              slots.push(json[j]);
              didIt = true;
            }
          }
          if (didIt) {
            didIt = false;
          } else {
            slots.push({
              slot: i,
            });
          }
        }
      } catch (err) {}
      console.log(slots);
      return slots;
    },
    hotBar() {
      return this.normalizeInventory.slice(0, 9);
    },
    invItems() {
      return this.normalizeInventory.slice(9);
    },
    filteredItems() {
      let filter = false;
      if (this.search.length > 2) {
        filter = (item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase());
      } else if (this.viewMode === 1) {
        filter = (item) => item.amount > 0;
      } else {
        filter = (item) => item;
      }
      return this.currentItems.filter(filter);
    },
  },
  mounted() {
    this.getItems();
  },
  methods: {
    updateItem(i, item) {
      this.$socket.emit("update_item", {
        item,
      });
    },
    deleteItem() {
      this.$socket.emit("delete_item", this.item);
    },
    getItems() {
      this.$socket.emit("get-inventory");
    },
    ...mapActions(["toggleQuickUpload"]),
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

:root {
  --slot-size: 30px;
  --mobile-slot-size: 20px;
  --background-color: #8e6144;
}

.box i {
  font-size: calc(var(--slot-size) - 6px);
  line-height: var(--slot-size);
  width: var(--slot-size);
  text-align: center;
  color: #292929;
}

.main1 {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;

  height: auto;
  padding: 0 15px;
  padding-bottom: 15px;
  max-width: 380px;
  background-color: #c6c6c6;
  box-shadow: 8px 0 0 0 #555555, 0 8px 0 0 #555555, 4px 4px 0 0 #555555,
    -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8, -4px -4px 0 0 #e8e8e8,
    0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8,
    -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000,
    -8px 4px 0 0 #000, -4px 8px 0 0 #000, -8px -8px 0 0 #000, 8px 8px 0 0 #000,
    -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000,
    0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000;
}

.box {
  height: var(--slot-size);
  width: var(--slot-size);
  background-color: #919191;
  box-shadow: 2px 2px 0 2px #e8e8e8, -2px -2px 0 2px #555, 0 0 0 4px #8b8b8b;
}

.box:hover {
  background-color: #c3c3c3;
}

.boxes {
  display: grid;
  align-content: center;
  grid-template-columns: repeat(9, calc(var(--slot-size) + 8px));
  grid-template-rows: repeat(6, calc(var(--slot-size) + 8px));
}

.boxes2 {
  display: grid;
  grid-template-columns: repeat(9, calc(var(--slot-size) + 8px));
  grid-template-rows: repeat(3, calc(var(--slot-size) + 8px));
  margin-bottom: 25px;
}

.boxes3 {
  display: grid;
  grid-template-columns: repeat(9, calc(var(--slot-size) + 8px));
  grid-template-rows: repeat(1, calc(var(--slot-size) + 8px));
}

.boxes,
.boxes2,
.boxes3 {
  margin-left: 8px;
  cursor: pointer;
}

h1 {
  font-family: "MinecraftiaRegular";
  font-weight: normal;
  font-style: normal;
  color: #555;
  display: inline-block;
  width: 100%;
  padding-left: 15px;
  font-size: 1.2em;
  line-height: 30px;
  margin-top: 0.5;
  margin-bottom: 0.5em;
}

/* box-shadow: none|h-offset v-offset blur spread color |inset|initial|inherit; */

@media (max-width: 600px) {
  .box {
    box-shadow: 1px 1px 0 1px #e8e8e8, -1px -1px 0 1px #555, 0 0 0 2px #8b8b8b;
  }

  .main1 {
    padding: 0 8px;
    padding-bottom: 8px;

    box-shadow: 4px 0 0 0 #555555, 0 4px 0 0 #555555, 2px 2px 0 0 #555555,
      -4px 0 0 0 #e8e8e8, 0 -4px 0 0 #e8e8e8, -2px -2px 0 0 #e8e8e8,
      0 0 0 2px #b5b4b5, 2px 4px 0 0 #555, 4px 2px 0 0 #555,
      -2px -4px 0 0 #e8e8e8, -4px -2px 0 0 #e8e8e8, 4px -2px 0 0 #000,
      2px -4px 0 0 #000, -4px 2px 0 0 #000, -2px 4px 0 0 #000,
      -4px -4px 0 0 #000, 4px 4px 0 0 #000, -6px 0 0 0 #000, -6px -2px 0 0 #000,
      6px 0 0 0 #000, 6px 2px 0 0 #000, 0 -6px 0 0 #000, -2px -6px 0 0 #000,
      0 6px 0 0 #000, 2px 6px 0 0 #000;
  }

  h1 {
    font-size: 1rem;
  }
}
</style>
