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
              <!--<a class="nav-link text-warning" href="#">Home <span class="sr-only">(current)</span></a>-->
            </li>
            <li class="nav-item">
              <router-link to="/post" class="text-warning nav-link">
                New Post
              </router-link>
            </li>
            <li class="nav-item">
                <a class="nav-link text-warning" href="#">About</a>
              </li>
            <li class="nav-item">
              <a class="nav-link disabled text-warning-50 " href="#" tabindex="-1" aria-disabled="true">Shop</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input v-model="sok" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <router-link :to="{name: 'Homesok', params: { sok: this.sok }}" class="btn btn-warning">Search</router-link>
          </form>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-warning" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Account
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Profile</a>
                <a class="dropdown-item" href="#">Settings</a>
                <div class="dropdown-divider"></div>
                <div v-if="!isAuthenticated">
                  <router-link to="/login" class="dropdown-item">
                    Login
                  </router-link>
                  <router-link to="/register" class="dropdown-item">
                    Register
                  </router-link>
                </div>
                <div v-if="isAuthenticated">
                  <router-link to="/logout/" class="dropdown-item">
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
    data(){
      return {
        sok: ''
      }
    },
    name: 'app-header',
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAutenticated
      },
    },
    methods: {
    },
  }
</script>
