<template>
</template>

<script>
  export default {
    name: 'logout',
    computed: {
      isAutenticated () {
          return this.$store.getters.isAutenticated
      }
    },
    created() {
        if (!this.isAutenticated) {
            this.$router.push('/')
        } else {
            this.$store.dispatch("logout")
            this.$router.push('/')
        }
    },
  }
</script>
