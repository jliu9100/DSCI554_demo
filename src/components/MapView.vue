<template>
  <div class="map-container">
    <l-map :zoom="zoom" :min-zoom="zoom" :max-zoom="zoom + 4" :center="center" style="height: 100%;">
      <l-tile-layer :url="tileUrl" :attribution="attribution" />
      <l-marker v-for="dataPoint in enrichedDataPoints" :key="dataPoint.id" :lat-lng="[dataPoint.lat, dataPoint.lng]"
      >
        <l-icon :icon-size="[dataPoint.iconSize,dataPoint.iconSize]"  icon-url="fire.png">
        </l-icon>
        <l-popup :content="dataPoint.name+' '+dataPoint.date+' '+dataPoint.lat+','+dataPoint.lng">
        </l-popup>
      </l-marker>
    </l-map>
  </div>
  <div>

  </div>
</template>
  
<script setup>
import { ref, defineProps, computed, watchEffect } from 'vue';
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
const props = defineProps({
  dataPoints: Array
});
const minSize = 10;
const maxSize = 40;
const minAcreage = ref(0);
const maxAcreage = ref(0);

const zoom = ref(5);
const center = ref([36.7783, -119.4179]);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">CaliforniaMap</a>';

const updateAcreageBounds = () => {
  const acreages = props.dataPoints.map(p => p.acreage);
  minAcreage.value = Math.min(...acreages);
  maxAcreage.value = Math.max(...acreages);
};

watchEffect(updateAcreageBounds);

const calculateIconSize = (acreage) => {
  const sizeRatio = (acreage - minAcreage.value) / (maxAcreage.value - minAcreage.value);
  const size = minSize + (maxSize - minSize) * sizeRatio;
  return Math.max(minSize, Math.min(size, maxSize));
};

const enrichedDataPoints = computed(() => 
  props.dataPoints.map(dp => ({
    ...dp,
    iconSize: calculateIconSize(dp.acreage)
  }))
);


</script>
  
<style>
.map-container {
  height: 400px;
  /* 或者其他你想要的高度 */
}
</style>
  