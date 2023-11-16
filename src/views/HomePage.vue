<!-- src/views/HomePage.vue -->
<template>
  <DataLoader v-slot="{ dataPoints }">
    
    <div v-if="dataPoints && dataPoints.length">
      <h1>{{ title }}</h1>
      <MapView :dataPoints="dataPoints" />
    </div>
    <div v-else>
      <h1>Loading...</h1>
  </div>
  </DataLoader>
</template>
  
<script setup>
import { ref } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import MapView from '@/components/MapView.vue';

const title = ref('Home Page');

</script>
  