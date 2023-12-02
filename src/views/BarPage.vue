<!-- src/views/HomePage.vue -->
<template>
  <div class="cont">
    <div class="map-container">
    <h1>
    Fires and Area Burned By Year
    </h1>
        <HomePageBarChart />
    </div>
    <div class="cardcont">
      <div class="card">
        <h2>More Fires</h2>
        <p>
        The last few years have seen a strong uptick in the number of wildfires occurring.
        </p>
        <p>
        Despite more fires burning, and, as seen before, the largest fires burning more acreage, the total area burned does not follow an upward trend.
        </p>
        <p>
       It is difficult to make strong claims from a ten year time window, considering that wildfires have been occurring since as long as 400 million years ago.
        </p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import HomePageBarChart from '@/components/HomePageBarChart.vue';
</script>
  
<style scoped>
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
h1 {
  padding-left: 30px;
  opacity: 70%;
}
</style>