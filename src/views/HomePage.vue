<!-- src/views/HomePage.vue -->
<template>
  <!-- <DataLoader @update:data="handleDataUpdate" /> -->
  <div class="map-container">
    <h1 class="map-title">{{ title }}</h1>
    <YearSelector :initial-year="currentYear" :initialMonth="currentMonth" @update:yearMonth="updateYearMonth" />
    <MapView :currentMonth="currentMonth" :currentYear="currentYear" />

    <!-- <HomePageBarChart /> -->
    <!-- <TimelapseContainer />
    <HomePageHeatMap /> -->
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import MapView from '@/components/MapView.vue';
import YearSelector from '@/components/YearSelector.vue';
import HomePageBarChart from '@/components/HomePageBarChart.vue';
import HomePageHeatMap from '@/components/HomePageHeatMap.vue';
import TimelapseContainer from "@/components/TimelapseContainer.vue";


const title = ref('CALIFORNIA WILDFIRES');

const currentYear = ref(2015);
const currentMonth = ref(new Date().getMonth() + 1);

onMounted(() => {
  const storedYear = sessionStorage.getItem('selectedYear');
  const storedMonth = sessionStorage.getItem('selectedMonth');
  if (storedYear && storedMonth) {
    currentYear.value = parseInt(storedYear, 10);
    currentMonth.value = parseInt(storedMonth, 10);
  }
  // console.log(currentYear.value)
});

const isLoading = ref(true);
const firstLoad = ref(true);

const updateYearMonth = (yearMonth) => {
  const { year, month } = yearMonth;
  // console.log('update')
  currentYear.value = year;
  currentMonth.value = month;
  sessionStorage.setItem('selectedYear', year);
  sessionStorage.setItem('selectedMonth', month);
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
}

.home-page-heat-map {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 40%;
}
</style>