<template>
  <div class="container-fluid w-75">
    <h2>Register</h2>
    <p v-if="errorMsg" class="alert alert-dark">{{errorMsg}}</p>
        <label for="username">Username:</label>
        <div>
        <input type="username" id="username" v-model="username">
        </div>
    <div>
        <label for="password">Password:</label>
        <div>
        <input type="password" id="password" v-model="password">
        </div>
    </div>
    <div class="mt-2">
        <a class="btn btn-secondary" @click="register">Register</a>
        <router-link to="/login">
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
      errorMsg: '' //the error to be shown if register fails
    }
  },
  methods: {
    register () {
      this.$store.dispatch('register', { username: this.username, password: this.password })
        .then(() => {
          if (this.$store.state.errorMsg == ''){ //checks if no error
            this.$router.push('/login/') //route to login so the user can log in to their new account
          } else { //if there is a error
            this.setError() //call setError function so errorMsg is set
          }
        })
    },
    setError(){
      this.errorMsg = this.$store.state.errorMsg //set errorMsg to the errorMsg in store/index.js (the errorMsg is used in a v-if that shows the errorMsg if there is one)
    }
  },
  beforeMount(){
    this.setError() //setError to the error from state
  }

}
</script>