<template>
  <div class="container-fluid w-75">
    <h2>Login</h2>
    <p v-if="errorMsg" class="alert alert-dark">{{errorMsg}}</p>
    <label for="username">Username:</label>
    <div>
      <input type="username" id="username" v-model="username">
    </div>
    <label for="password">Password:</label>
    <div>
      <input type="password" id="password" v-model="password">
    </div>
    <div class="mt-2">
      <a class="btn btn-secondary" @click="authenticate">Login</a>
      <router-link to="/register">
      Don't have an account?
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
      errorMsg: '' //error message to be shown if there was an error logging in, posting, deleting or liking
    }
  },
  methods: {
    authenticate () {
      this.$store.dispatch('login', { username: this.username, password: this.password }) //when login button is pressed this funciton is called to authenticate
        .then(() => {
          if (localStorage.getItem('user')){ //if the user gets logged in it gets a "user" item in local storage. If user can be found in local storage the user is routed to home
            this.$router.push('/') 
          } else {
            this.setError() //if the user is not logged in this function is called to set errorMsg to the error thrown
          }
        })
    },
    setError(){
      this.errorMsg = this.$store.state.errorMsg //set errorMsg to the errorMsg present in state
    }
  },
  beforeMount(){
    this.setError() //run setError when the page is being mounted to make errorMsg the error that is in state
  }
}
</script>