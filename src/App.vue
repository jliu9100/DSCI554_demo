<template>
  <div id="app" v-if="loaded">
    <TheNavbar v-if="showNavbar" />
    <router-view />
  </div>
  <div v-if="!loaded">
    <LoadingPage />
  </div>
</template>

<script setup>
import TheNavbar from './components/NavBar.vue';
import { computed, watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTimelapseDataStore } from "@/stores/timelapseData";

const route = useRoute();
const showNavbar = computed(() => !route.meta.hideNavigation);
const loaded = ref(false);
const store = useTimelapseDataStore();
await store.loadData();
watchEffect(() => {
  loaded.value = true;
})
</script>

<style></style>
