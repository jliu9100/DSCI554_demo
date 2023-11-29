<!-- src/views/HomePage.vue -->
<template>
  <DataLoader @update:data="handleDataUpdate" />
  <h1>{{ title }}</h1>
  <div v-loading.fullscreen.lock="isLoading">
  <Page2PieChart :dataPoints="dataPoints" 
  @loading="handleMapLoading"
  @loaded="handleMapLoaded"
  />
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import Page2PieChart from '@/components/Page2PieChart.vue';

const dataPoints = ref([]);
// Wildfire Causes 的分布
const title = ref('Wildfire Causes in California, 2005-2015');
const isLoading = ref(true);
const handleDataUpdate = (updatedData) => {
  dataPoints.value = updatedData;
};
const handleMapLoading = () => {
  isLoading.value = true;
};

const handleMapLoaded = () => {
  isLoading.value = false;
};
</script>
  