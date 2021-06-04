<!--The template containes app-header which shows the header file(shown on all routes) which containes the navbar-->
<!--router-view is what is shown on the page (beneath the navbar) and is decided by router/index.js-->
<template>
  <div id="app">
    <app-header/>
    <router-view/>
  </div>
</template>

<script>
//importing Header here since it is used on all routes
import Header from '@/components/Header'

export default {
  name: 'App',
  components: {
    'app-header': Header
  }
}
</script>
<!-- Some simple css for setting background color and making sure container-fluid covers the entire height of the page-->
<style>
  .container-fluid {
    background-color: rgb(255, 166, 0);
    height: auto;
    min-height: 100vh;
  }
  body {
    background-color: rgb(85, 85, 85);
  }
</style>
