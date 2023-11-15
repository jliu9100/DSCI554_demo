<!-- src/views/HomePage.vue -->
<template>
  <DataLoader v-slot="{ dataPoints }">
    <div>
      <h1>{{ title }}</h1>
      <MapView :dataPoints="dataPoints" />
    </div>
  </DataLoader>
</template>
  
<script setup>
import { ref } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import MapView from '@/components/MapView.vue';

const title = ref('Home Page');

</script>
  