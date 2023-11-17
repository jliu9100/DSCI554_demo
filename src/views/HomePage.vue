<!-- src/views/HomePage.vue -->
<template>
  <DataLoader @update:data="handleDataUpdate">
    <div class="map-container" v-loading.fullscreen.lock="isLoading">
      <div v-if="dataPoints && dataPoints.length">
        <h1 class="map-title">{{ title }}</h1>
        <YearSelector :available-years="availableYears" :initial-year="currentYear" @update:year="updateYear" />
        <MapView :dataPoints="filteredDataPoints" />
      </div>
    </div>
  </DataLoader>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import MapView from '@/components/MapView.vue';
import YearSelector from '@/components/YearSelector.vue';

const title = ref('Home Page');
const currentYear = ref(new Date().getFullYear());
onMounted(() => {
  const storedYear = sessionStorage.getItem('selectedYear');
  if (storedYear) {
    currentYear.value = parseInt(storedYear, 10);
  }
});
const startYear = 1985;
const endYear = 2024;
const availableYears = ref([...Array(endYear - startYear + 1)].map((_, i) => i + startYear));

const dataPoints = ref([]);
const isLoading = ref(true);

const handleDataUpdate = (updatedData) => {
  dataPoints.value = updatedData;
  isLoading.value = false;
};

const filteredDataPoints = computed(() => {
  return dataPoints.value.filter(dp => dp.year === currentYear.value);
});

const updateYear = (newYear) => {
  currentYear.value = newYear;
  sessionStorage.setItem('selectedYear', newYear);
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

.year-selector {
  position: absolute;
  top: 1rem;
  right: 2rem;
  z-index: 1000;
}

.year-selector .el-button {
  margin: 0 10px;
}

.year-selector .el-select {
  width: 120px;
}</style>