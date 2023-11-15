<template>
  <div class="map-container">
    <l-map :zoom="zoom" :min-zoom="zoom - 2" :max-zoom="zoom + 2" :center="center" style="height: 100%;">
      <l-tile-layer :url="tileUrl" :attribution="attribution" />
      <l-marker v-for="dataPoint in props.dataPoints" :key="dataPoint.id" :lat-lng="[dataPoint.lat, dataPoint.lng]"
        @ready="console.log(dataPoint.id, [dataPoint.lat, dataPoint.lng])">
        <l-icon :icon-size="[32, 37]" :icon-anchor="[16, 37]" icon-url="fire.png">
        </l-icon>
      </l-marker>
    </l-map>
  </div>
  {{ [(props.dataPoints[0].lat), props.dataPoints[0].lng] }}
  <div>

  </div>
</template>
  
<script setup>
import { ref, defineProps } from 'vue';
import { LMap, LTileLayer, LMarker, LIcon } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
const props = defineProps({
  dataPoints: Array
});

const zoom = ref(5);
const center = ref([36.7783, -119.4179]);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">CaliforniaMap</a>';



</script>
  
<style>
.map-container {
  height: 400px;
  /* 或者其他你想要的高度 */
}
</style>
  