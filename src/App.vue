<template>
  <div id="app">
    <TheNavbar/>
    <DataLoader />
    <router-view/>
  </div>
</template>

<script setup>
import TheNavbar from './components/NavBar.vue';
import DataLoader from './components/DataLoader.vue';
</script>

<style>
/* 添加全局样式 */
</style>
