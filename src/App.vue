<template>
  <div id="app">
    <TheNavbar v-if="showNavbar"/>
    <router-view/>
  </div>
</template>

<script setup>
import TheNavbar from './components/NavBar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const showNavbar = computed(() => !route.meta.hideNavigation);
</script>

<style>
</style>
