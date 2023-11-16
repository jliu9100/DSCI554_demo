<!-- src/components/DataLoader.vue -->
<template>
    <div>
        <slot :dataPoints="dataPoints"></slot>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';

const dataPoints = ref([
    { id: 1, name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { id: 2, name: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { id: 3, name: 'San Jose', lat: 37.3382, lng: -121.8863 },
    { id: 4, name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { id: 5, name: 'Fresno', lat: 36.7378, lng: -119.7871 },
    { id: 6, name: 'Sacramento', lat: 38.5816, lng: -121.4944 },
    { id: 7, name: 'Long Beach', lat: 33.7701, lng: -118.1937 },
    { id: 8, name: 'Oakland', lat: 37.8044, lng: -122.2711 },
    { id: 9, name: 'Bakersfield', lat: 35.3733, lng: -119.0187 },
    { id: 10, name: 'Anaheim', lat: 33.8366, lng: -117.9143 },
]);
</script>