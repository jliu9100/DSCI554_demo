<template>
  <div class="map-container">
    <l-map :zoom="zoom" :min-zoom="zoom" :max-zoom="zoom + 4" :center="center" style="height: 100%;">
      <l-tile-layer :url="tileUrl" :attribution="attribution" />
      <l-marker v-for="dataPoint in enrichedData" :key="dataPoint.id" :lat-lng="[dataPoint.lat, dataPoint.lng]">
        <!-- <p>{{ dataPoint }}</p> -->
        <l-icon :icon-size="[dataPoint.iconSize, dataPoint.iconSize]" icon-url="fire.png">
        </l-icon>
        <l-popup :content="'Cause: ' + dataPoint.name + '; Fire Size Level: ' + dataPoint.acreage">
        </l-popup>
      </l-marker>
    </l-map>
  </div>
  <div>

  </div>
</template>
  
<script setup>
import { ref, defineProps, computed, watchEffect, toRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

import { useGeneralDataStore } from "@/stores/generalData";
let { data } = storeToRefs(useGeneralDataStore());

const props = defineProps([
  'currentYear',
  'currentMonth'
]);

const filteredData = computed(() => {
  return data.value.filter(
    dp => dp.year === props.currentYear && dp.month === props.currentMonth)
});

const minSize = 10;
const maxSize = 40;
const minAcreage = ref(0);
const maxAcreage = ref(0);

const zoom = ref(4.5);
const center = ref([36.7783, -119.4179 - 10]);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">CaliforniaMap</a>';

const updateAcreageBounds = () => {
  const acreages = filteredData.value.map(p => p.acreage);
  minAcreage.value = Math.min(...acreages);
  maxAcreage.value = Math.max(...acreages);
};

watchEffect(updateAcreageBounds);

const calculateIconSize = (acreage) => {
  const sizeRatio = (acreage - minAcreage.value) / (maxAcreage.value - minAcreage.value);
  const size = minSize + (maxSize - minSize) * sizeRatio;
  return Math.max(minSize, Math.min(size, maxSize));
};

const enrichedData = computed(() => 
  filteredData.value.map(dp => ({
    ...dp,
    iconSize: calculateIconSize(dp.acreage)
  })));


</script>
  
<style>
.map-container {
  height: 400px;
}
</style>
  