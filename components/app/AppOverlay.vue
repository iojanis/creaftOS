<template>
  <transition name="fastfade">
    <div v-if="$store.state.Overlay" class="overlay" @click="toggleAll(false)" />
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AppOverlay',
  methods: {
    ...mapActions(['toggleAll'])
  }
}
</script>

<style scoped>
    .overlay {
        /* Height & width depends on how you want to reveal the overlay (see JS below) */
        height: 100vh;
        width: 100vw;
        position: fixed; /* Stay in place */
        left: 0;
        top: 0;
        z-index: 104;
        background-color: rgba(10, 10, 29, 0.76); /* Black w/opacity */
        overflow-x: hidden; /* Disable horizontal scroll */
        transition: 0.5s; /* 0.5 second transition effect to slide in or slide down the overlay (height or width, depending on reveal) */
    }
</style>
