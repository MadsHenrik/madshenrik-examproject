<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary text-warning">
        <router-link to="/" class="nav-brand" style="margin: 0; padding: 0;">
            <img src="@/assets/highfire_logo_transparent.png" width="50" height="50">
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link to="/" class="text-warning nav-link">
                  Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/post" class="text-warning nav-link">
                New Post
              </router-link>
            </li>
          </ul>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-warning" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Account
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <div v-if="!isAuthenticated">
                  <router-link to="/login" class="dropdown-item">
                    Login
                  </router-link>
                  <router-link to="/register" class="dropdown-item">
                    Register
                  </router-link>
                </div>
                <div v-if="isAuthenticated">
                  <router-link to="/logout" class="dropdown-item">
                    Log out
                  </router-link>
                </div>
              </div>
          </div>
        </div>
      </nav>
</template>

<script>
  export default {
    name: 'app-header', 
    computed: {
      isAuthenticated () {
        return this.$store.state.isLoggedIn //compute the value of isLoggedIn to see if logout or login and register should be shown
      },
    },
    beforeMount(){
      if (localStorage.getItem('user')){ //if there is a user saved in localstorage, the user is logged in. isLoggedIn is true
        this.$store.state.isLoggedIn = true
      } else { //if there is no user saved in localstorage, isLoggedIn is false
        this.$store.state.isLoggedIn = false
      }
    }
  }
</script>
