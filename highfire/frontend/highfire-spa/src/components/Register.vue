<template>
  <div class="container-fluid w-75">
    <div class="">
        <h2 class="">Register</h2>
    </div>
        <p v-if="errorMsg" class="alert alert-dark">{{errorMsg}}</p>
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
        .then(() => {
          if (this.$store.state.errorMsg == ''){
            this.$router.push('/login/')
          } else {
            console.log(this.$store.state.errorMsg)
            console.log(this.errorMsg)
            this.setError()
          }
        })
    },
    setError(){
      this.errorMsg = this.$store.state.errorMsg
    }
  },
  beforeMount(){
    this.setError()
  }

}
</script>