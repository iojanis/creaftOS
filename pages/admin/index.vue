<template>
  <div class="ui fluid container" style="padding: 0.5em;">
    <div class="ui inverted relaxed list" style="background: transparent!important;">
      <div class="item">
        <div class="content">
          <div class="header normal-font">
            Snickerdoodle
          </div>
        </div>
      </div>
      <div class="item">
        <div class="content">
          <div class="header">
            Poodle
          </div>
        </div>
      </div>
      <div class="item">
        <div class="content">
          <div class="header">
            Paulo
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'terminal',
  mounted () {
    this.$store.watch(
      (state) => {
        try {
          console.log(this.$store.state.auth.user.username)
          this.$socket.emit('auth', {
            token: this.$auth.getToken('local'),
            user: this.$auth.user.username
          })
          return this.$store.state.auth.loggedIn
        } catch (e) {
          console.log(e)
        }
      }, (val) => {}, { deep: true }
    )
  }
}
</script>

<style>
  body {
    font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif!important;
  }
</style>
