<template>
  <div class="terminal-layout">
    <div class="ui three item menu inverted">
      <a class="item">Terminal</a>
      <a class="item">Test</a>
    </div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  mounted() {
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
</style>
