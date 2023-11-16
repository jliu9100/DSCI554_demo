<template>
  <div id="app">
    <TheNavbar/>
    <router-view/>
  </div>
</template>

<script setup>
import TheNavbar from './components/NavBar.vue';
</script>

<style>
/* 添加全局样式 */
</style>
