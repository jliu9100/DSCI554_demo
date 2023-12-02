<!-- src/views/SubPage1.vue -->
<template>
  <!-- <DataLoader @update:data="handleDataUpdate" /> -->
  <div v-loading.fullscreen.lock="isLoading1 || isLoading2">
    <h1>{{ title }}</h1>


    <el-row>
      <el-col :span="8">
        <!-- <div v-if="dataPoints && dataPoints.length"> -->
          <h2 class="x">{{ subtitle1 }}</h2>
          <Page1ChoroplethMap mapType="sum" :selectedCounty="selectedCounty" @loading="handleMapLoading(1)"
            @loaded="handleMapLoaded(1)" />
        <!-- </div> -->
      </el-col>

      <el-col :span="8">
        <!-- <div v-if="dataPoints && dataPoints.length"> -->
          <h2 class="x">{{ subtitle2 }}</h2>
          <Page1ChoroplethMap  mapType="count" :selectedCounty="selectedCounty" @loading="handleMapLoading(2)"
            @loaded="handleMapLoaded(2)" />
        <!-- </div> -->
      </el-col>


      <el-col :span="8">
        <h2>{{ subtitle3 }}</h2>
        <div class="select-container">
          <el-select v-model="selectedCounty" 
          filterable
          clearable
          remote
          style="width: 60%"
          :remote-method="handleSearch"  placeholder="Select or search a county"
            no-match-text="No results">
            <el-option v-for="county in filteredCountyNames" :key="county" :label="county" :value="county"></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import Page1ChoroplethMap from '@/components/Page1ChoroplethMap.vue';

const title = ref('Wildfire Acres Burned in California, 2005-2015');
const subtitle1 = ref('Cumulative Fire Size by County (Acres)');
const subtitle2 = ref('Number of Fires by County');
const subtitle3 = ref('Where are you located?');

// const dataPoints = ref([]);
const isLoading1 = ref(true);
const isLoading2 = ref(true);
const countyNames = ref([
  'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa',
  'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial',
  'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin',
  'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa',
  'Nevada', 'Orange', 'Placer', 'Plumas', 'Riverside', 'Sacramento',
  'San Benito', 'San Bernardino', 'San Diego', 'San Francisco', 'San Joaquin',
  'San Luis Obispo', 'San Mateo', 'Santa Barbara', 'Santa Clara', 'Santa Cruz',
  'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus', 'Sutter',
  'Tehama', 'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba'
]);

const query = ref('');

const filteredCountyNames = computed(() => {
  return countyNames.value.filter(
    county => county.toLowerCase().startsWith(query.value.toLowerCase())
  );
});

function handleSearch(searchQuery) {
  query.value = searchQuery;
}

const selectedCounty = ref('')

// const handleDataUpdate = (updatedData) => {
//   dataPoints.value = updatedData;
// };

const handleMapLoading = (loaderId) => {
  if (loaderId === 1) {
    isLoading1.value = true;
  } else {
    isLoading2.value = true;
  }
};

const handleMapLoaded = (loaderId) => {
  if (loaderId === 1) {
    isLoading1.value = false;
  } else {
    isLoading2.value = false;
  }
};
</script>
  
<style scoped>
h1 {
  padding-left: 40px;
  opacity: 90%;
  padding-top: 15px;
}
h2.x {
  padding-left: 40px;
  padding-right: 50px;
  opacity: 65%;
}
</style>