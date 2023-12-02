<!-- src/views/HomePage.vue -->
<template>
  <!-- <DataLoader @update:data="handleDataUpdate" /> -->
  <div class="cont">
    <div class="map-container">
      <HomePageHeatMap />
      <!-- <h1 class="map-title">{{ title }}</h1> -->
      <YearSelector :initial-year="currentYear" :initialMonth="currentMonth" @update:yearMonth="updateYearMonth" />
      <MapView :currentMonth="currentMonth" :currentYear="currentYear" />
    </div>
    <div class="cardcont">
      <div class="card">
        <h2>Longer Fire Seasons</h2>
        <p>
        The severity of wildfire burns, as well as the time of year that wildfires burn, has evolved over the last 20
        years.
        </p>
        <p>
        Use the month selector to explore the wildfire occurences in a given month.
        </p>
        <p>
        Observe, with the heat map on the left, how the intensity of wildfire burns in the shoulder season, March-May and September-December, has increased in recent years.
        </p>
      </div>
    </div>
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
  width: 65vw;
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
  width: 80%;
}

.cont {
  display: flex;
}

.cardcont {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 34vw;
  margin-right: 50px;
}

.card {
  padding-left: 20px;
  padding-right: 13px;
  width: 24vw;
  height: 54vh;
  /* Add shadows to create the "card" effect */
  box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.card p {

  font-size: 12px;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 4px 8px 16px 4px rgba(0, 0, 0, 0.2);
}
</style>