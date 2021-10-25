<template>
  <div class="ui text container" style="margin-top: 4em; max-width: 350px;">
    <div class="ui vertical horizontal aligned segment">
      <form class="ui large form inverted" @submit.prevent="handleSubmit">
        <h1 class="ui yellow header">
          CraftOS/Join
        </h1>
        <div class="field">
          <div class="ui error message">
            <div class="header">
              Error
            </div>
          </div>
        </div>
        <div class="inverted field">
          <div class="ui large left inverted input">
            <input v-model="ticket" type="text" placeholder="Ticket">
          </div>
        </div>
        <div class="inverted field">
          <label style="color: white;">
            You will get a ticket as soon as you connect to the server.
          </label>
        </div>
        <div class="inverted field">
          <div class="ui large left inverted input">
            <input v-model="password" type="password" placeholder="Password">
          </div>
        </div>
        <div class="inverted field">
          <div class="ui large left inverted input">
            <input v-model="passwordConfirm" type="password" placeholder="Confirm Password">
          </div>
        </div>
        <!--      <div class="inverted field" style="margin-bottom: 2em;">-->
        <!--        <div class="ui inverted checkbox">-->
        <!--          <input v-model="accept" class="hidden" type="checkbox" name="terms" tabindex="0">-->
        <!--          <label class="inverted rules" style="color: #fff" data-content="short-rules" data-variation="">I accept the rules</label>-->
        <!--        </div>-->
        <!--      </div>-->
        <button type="submit" class="ui fluid big inverted yellow submit button">Create Account</button>
        <div class="field" style="margin-top: 1em;">
          <router-link :to="{ name: 'login' }">
            <div class="ui fluid inverted basic button">Login</div>
          </router-link>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  auth: false,
  data() {
    return {
      ticket: '',
      password: '',
      passwordConfirm: ''
    }
  },
  methods: {
    ...mapActions(['createUserAccount']),
    handleSubmit(e) {
      e.preventDefault()
      const options = {
        ticket: this.ticket,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }
      this.createUserAccount(options)
      this.$router.push('login')
    }
  }
}
</script>
