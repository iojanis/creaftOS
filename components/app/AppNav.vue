<template>
  <transition name="slideUp">
    <div v-if="loaded" class="centered-menu bordered ui bottom eight labeled icon sidebar menu push visible inverted blurred">
      <nuxt-link
        v-for="Item in MenuItems"
        :key="Item.name"
        :to="{ name: Item.name }"
        :class="{ disabled: Item.auth && !$auth.loggedIn }"
        active-class="active"
        class="bordered item">
        <img :src="'/mcicons/' + Item.icon + '.png'" draggable="false" class="img-icon">
        {{ Item.title }}
      </nuxt-link>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppBar',
  data() {
    return {
      loaded: false,
      MenuItems: [
        {
          name: 'chat',
          title: 'CHAT',
          icon: '381-0',
          auth: false,
          disabled: false
        },
        {
          name: 'forum',
          title: 'FORUM',
          icon: '387-1',
          auth: true,
          disabled: true
        },
        {
          name: 'stock',
          title: 'STOCK',
          icon: '54-0',
          auth: true,
          disabled: false
        },
        {
          name: 'market',
          title: 'MARKET',
          icon: '264-0',
          auth: true,
          disabled: false
        },
        {
          name: 'bank',
          title: 'BANK',
          icon: '384-0',
          auth: true,
          disabled: true
        },
        {
          name: 'team',
          title: 'TEAM',
          icon: '354-0',
          auth: true,
          disabled: true
        },
        {
          name: 'map',
          title: 'MAP',
          icon: '345-0',
          auth: true,
          disabled: true
        }
      ]
    }
  },
  mounted() {
    this.loaded = true
  }
}
</script>

<style scoped>
  .bordered.item {
    margin: 2px;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
    border: 2px solid rgba(255, 255, 255, 0);
    margin-right: 4px!important;
  }
  .centered-menu {
    margin: 0;
    padding: 0;
  }
  @media only screen and (min-width: 750px) {
    .centered-menu {
      z-index: 1000;
      border-top: 0px solid rgba(255, 255, 255, 0.16) !important;
      display: flex!important;
      justify-content: center!important;
    }
  }
  .bordered.item {
    margin: 0;
    border: 2px dashed rgba(255, 255, 255, .0) !important;
  }
  .bordered.item.disabled {
    margin: 0;
    color: #878787 !important;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    border: 2px dashed rgba(255, 255, 255, .0) !important;
  }
  .bordered.item:hover {
    margin: 0;
    border: 2px dashed rgba(255, 255, 255, .1) !important;
  }
  .bordered.item:active {
    border: 2px dashed rgba(255, 255, 255, .5) !important;
  }
  .ui.inverted.menu.bordered .active.item {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
    border: 2px solid rgba(255, 255, 255, 0.2)!important;
  }
  .img-icon {
    margin-bottom: 0.5em!important;
    height: 32px!important;
    width: 32px!important;
  }
  .ui.menu .item:before {
    width: 0px!important;
    background: none!important;
  }
  .inverted.blurred {
    box-shadow: none!important;
    backdrop-filter: blur(5px)!important;
    background: rgba(3, 1, 25, 0.9) !important;
  }

</style>
