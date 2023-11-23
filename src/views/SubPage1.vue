<!-- src/views/SubPage1.vue -->
<template>
  <DataLoader @update:data="handleDataUpdate">
    <div class="map-container" v-loading.fullscreen.lock="isLoading">
      <div v-if="dataPoints && dataPoints.length">
        <h1 class="map-title">{{ title }}</h1>
        <Page1ChoroplethMap :dataPoints="dataPoints" />
      </div>
    </div>
  </DataLoader>
</template>
  
<script setup>
import { ref } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import Page1ChoroplethMap from '@/components/Page1ChoroplethMap.vue';

const title = ref('Wildfire Acres Burned in California, 1984-2021');

const dataPoints = ref([]);
const isLoading = ref(true);

const handleDataUpdate = (updatedData) => {
  dataPoints.value = updatedData;
  isLoading.value = false;
};
</script>
  
<style>
.map-container {
  position: relative;
}

.map-title {
  position: absolute;
  top: 1rem;
  left: 3rem;
  z-index: 1000;
}



</style>