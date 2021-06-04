<!-- this page is empty as the user is never really on it-->
<template>
</template>

<script>
  export default {
    name: 'logout',
    computed: {
      isAutenticated () {
          return this.$store.getters.isAutenticated //check if there is a user
      }
    },
    created() {
        if (!this.isAutenticated) { //if there is no user logged in the user is routed to home
            this.$router.push('/')
        } else { //if there is a user, that user is logged out and is routed to home
            this.$store.dispatch("logout")
            this.$router.push('/')
        }
    },
  }
</script>
