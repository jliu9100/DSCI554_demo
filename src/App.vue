<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>

<script>
import TheNavbar from './components/NavBar.vue';


export default {
  name: 'App',
  components: {
    TheNavbar
  }
};
</script>

<style>
/* 添加全局样式 */
</style>
