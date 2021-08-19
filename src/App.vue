<template>
  <div id="App" class="app-container">
    <NavBar v-if="isNotInLogIn() && isNotError() && isNotForbidden()"></NavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './views/components/NavBar.vue';

export default {
  name: 'App',
  data(){
    return{
    }
  },
  components: {
    NavBar
  },
  beforeMount(){
    this.$store.dispatch('setCurrentLocation');
  },
  methods: {
    isNotInLogIn() {
      return this.$router.history.current["name"] != "login";
    },
    isNotError() {
      return this.$router.history.current["name"] != "error";
    },
    isNotForbidden() {
      return this.$router.history.current["name"] != "forbidden";
    }
  }
}
</script>

<style>
  @import './assets/css/custom.css';
  body {
    background-color: #d7d7d7 !important;
  }
  .app-container {
      min-width: 411px !important;
  }
</style>
