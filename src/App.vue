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
import LoadingPage from '@/views/LoadingPage.vue';
import { computed, watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTimelapseDataStore } from "@/stores/timelapseData";
import { usePackDataStore } from "@/stores/packData";
import { useGeneralDataStore } from "@/stores/generalData";
import { useCauseDataStore } from "@/stores/causeData";

const route = useRoute();
const showNavbar = computed(() => !route.meta.hideNavigation);
const loaded = ref(false);
const timelapseStore = useTimelapseDataStore();
const packStore = usePackDataStore();
const generalStore = useGeneralDataStore();
const causeStore = useCauseDataStore();
await Promise.all([
  await timelapseStore.loadData(),
  await packStore.loadData(),
  await generalStore.loadData(),
  await causeStore.loadData()
]);
watchEffect(() => {
  loaded.value = true;
})
</script>

<style></style>
