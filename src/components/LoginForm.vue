<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-header">Please login</h1>
      <div class="login-choose">
        <label>
          <input type="radio" name="login-type" @change="changeLoginType('upass')" :checked="loginType === 'upass'">
          <span>Username - Password</span>
        </label>
        <label>
          <input type="radio" name="login-type" @change="changeLoginType('upin')" :checked="loginType === 'upin'">
          <span>Username - Pin</span>
        </label>
      </div>
      <form class="login-form" @submit.prevent="Authorize">
        <div class="login-row" v-if="loginType === 'upass'">
          <div class="title">Username</div>
          <div>
            <input id="user-login" type="text" name="email" v-model.trim="email" >
<!--            <small class="helper-text invalid" v-if="v$.email.$error">Please enter valid username</small>-->
          </div>
        </div>
        <div class="login-row" v-if="loginType === 'upass'">
          <div class="title">Password</div>
          <div>
            <input id="user-password" type="password" name="password" v-model.trim="password" :class="{ invalid: v$.password.$error }">
            <small class="helper-text invalid" v-if="v$.password.$error">Please enter valid password</small>
            <small class="helper-text invalid" v-if="AuthError">Incorrect login or password.</small>
          </div>
        </div>
        <div class="login-row" v-if="loginType === 'upin'">
          <div class="title">Pin</div>
          <div>
            <input id="user-pin" type="password" name="password" v-model.trim="password" :class="{ invalid: v$.password.$error }">
            <small class="helper-text invalid" v-if="v$.password.$error">Please enter valid pin</small>
            <small class="helper-text invalid" v-if="AuthError">Incorrect login or pin.</small>
          </div>
        </div>
        <div class="login-buttons">
          <button class="sign-in">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
  name: 'login-form',
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    email: '',
    password: '',
    AuthError: false,
    loginType: 'upass'
  }),
  validations: {
    password: { required, minLength: minLength(4) }
  },
  methods: {
    changeLoginType (type) {
      this.loginType = type
      console.log(this.loginType)
    },
    async Authorize () {
      if (this.v$.$invalid) {
        this.AuthErrorHide()
        this.v$.$touch()
        return
      }

      const formData = {
        email: this.email,
        password: this.password,
        loginType: this.loginType
      }

      try {
        this.AuthErrorHide()
        await this.$store.dispatch('logout')
        await this.$store.dispatch('login', formData)

        this.$router.push('/scopes')
      } catch (e) {
        this.AuthErrorShow()
      }
    },
    AuthErrorShow () {
      this.AuthError = true
      if (document.querySelector('#user-login')) document.querySelector('#user-login').classList.add('invalid')
      if (document.querySelector('#user-password')) document.querySelector('#user-password').classList.add('invalid')
      if (document.querySelector('#user-pin')) document.querySelector('#user-pin').classList.add('invalid')
    },
    AuthErrorHide () {
      this.AuthError = false
      if (document.querySelector('#user-login')) document.querySelector('#user-login').classList.remove('invalid')
      if (document.querySelector('#user-password')) document.querySelector('#user-password').classList.remove('invalid')
      if (document.querySelector('#user-pin')) document.querySelector('#user-pin').classList.remove('invalid')
    }
  }
}
</script>

<style>
  .login-choose{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  .login-choose span{
    margin-left: 15px;
  }
</style>
