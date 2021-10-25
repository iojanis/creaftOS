<template>
  <div class="ui text container" style="margin-top: 4em; max-width: 350px;">
    <div class="ui vertical horizontal aligned segment">
      <form class="ui large form" @submit.prevent="handleSubmit">
        <h1 class="ui yellow header">
          CraftOS/Login
        </h1>
        <div class="inverted field">
          <div class="ui large left input inverted">
            <input v-model="username" type="text" placeholder="Username">
          </div>
        </div>
        <div class="inverted field">
          <div class="ui large left input inverted">
            <input v-model="password" type="password" placeholder="Password">
          </div>
        </div>
        <!--        <div class="inverted field" style="margin-bottom: 2em;">-->
        <!--          <div class="ui inverted checkbox">-->
        <!--            <input v-model="remember" class="hidden" type="checkbox" name="terms" tabindex="0">-->
        <!--            <label class="rules inverted" style="color: #fff" data-content="short-rules" data-variation="">Remember me</label>-->
        <!--          </div>-->
        <!--        </div>-->
        <button type="submit" class="ui fluid big submit yellow inverted button">Login</button>
        <div class="inverted field" style="margin-top: 1em;">
          <router-link :to="{ name: 'join' }">
            <div class="ui fluid basic inverted  button">Create Account</div>
          </router-link>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
export default {
  auth: false,
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      try {
        this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        }, (response) => {
          this.$router.push('/')
        })
      } catch (e) {
        this.password = ''
        // eslint-disable-next-line no-console
        console.log(e.response.data.message)
      }
    }
  }
}
</script>
