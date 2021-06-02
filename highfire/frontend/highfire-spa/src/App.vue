<template>
  <div id="app">
    <app-header/>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'App',
  components: {
    'app-header': Header
  }
}
</script>

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
