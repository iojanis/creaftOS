<template>
  <div v-if="$store.state.Crashed" class="overlay">
    <div class="center">
      <div>
        <h3 class="ui white header">
          <span style="background: rgba(204,204,204,0.09); padding-left: 0.3em; padding-right: 0.2em"> CONNECTION INTERRUPTED.</span>
        </h3>
        <p>SERVER IS REBOOTING.</p>
        <p>PLEASE WAIT...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCrashed'
}
</script>

<style scoped>
    .overlay {
        backdrop-filter: blur(5px)!important;
        /* Height & width depends on how you want to reveal the overlay (see JS below) */
        height: 100vh;
        width: 100vw;
        position: fixed; /* Stay in place */
        left: 0;
        top: 0;
        text-align: center;
        z-index: 11111111;
        background-color: rgba(6, 7, 50, 0.95); /* Black w/opacity */
        overflow-x: hidden; /* Disable horizontal scroll */
        transition: 0.5s; /* 0.5 second transition effect to slide in or slide down the overlay (height or width, depending on reveal) */
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
        color: #cccccc!important;
    }
</style>
