<template>
  <div class="container-fluid w-75">
    <div class="">
        <h2 class="">Register</h2>
    </div>
    <div class="">
        <label class="" for="username">Username:</label>
        <div class="">
        <input type="username" class="" id="username" v-model="username">
        </div>
    </div>
    <div class="">
        <label class="" for="password">Password:</label>
        <div class="">
        <input type="password" class="" id="password" v-model="password">
        </div>
    </div>

    <div class="">
        <a class="" @click="register">Register</a>
        <router-link to="/login" class="">
        Already have an account?
        </router-link>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/utils'

export default {
  data () {
    return {
      username: '',
      password: '',
      errorMsg: ''
    }
  },
  methods: {
    register () {
      this.$store.dispatch('register', { username: this.username, password: this.password })
        .then(() => this.$router.push('/login/'))
    }
  },
  mounted () {
    EventBus.$on('failedRegistering', (msg) => {
      this.errorMsg = msg
    })
  },
  beforeDestroy () {
    EventBus.$off('failedRegistering')
  }
}
</script>