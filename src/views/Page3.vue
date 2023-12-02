<!-- src/views/SubPage1.vue -->
<template>
  <!-- <DataLoader @update:data="handleDataUpdate" /> -->
  <div v-loading.fullscreen.lock="isLoading1" style="height=80vh">
    <h1>{{ title }}</h1>


    <el-row>
      <el-col :span="12">
        <div v-if="data && data.length">
          <h2>{{ subtitle1 }}</h2>
          <Page3DensityMap :dataPoints="data" mapType="map1" @loading="handleMapLoading" @loaded="handleMapLoaded" />
        </div>
      </el-col>

      <el-col :span="12">
        <div v-if="data && data.length">
          <h2>{{ subtitle2 }}</h2>
          <Page3DensityMap :dataPoints="data" mapType="map2" @loading="handleMapLoading" @loaded="handleMapLoaded" />
        </div>
      </el-col>

    </el-row>
  </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import Page3DensityMap from '@/components/Page3DensityMap.vue';
import { useGeneralDataStore } from "@/stores/generalData";

const { data }  = useGeneralDataStore();

const title = ref('Risky areas for wild fire in California');
const subtitle1 = ref('Map of risky area for wild fire based on prediction for potential locations');
const subtitle2 = ref('Map of risky area for wild fire based on year 2015');
const dataPoints = ref([]);
const isLoading1 = ref(true);

// const handleDataUpdate = (updatedData) => {
//   dataPoints.value = updatedData;
// };

const handleMapLoading = () => {
    isLoading1.value = true;
};

const handleMapLoaded = () => {
    isLoading1.value = false;
};
</script>
  
<style scoped>
h1 {
  padding-left: 40px;
  opacity: 90%;
  padding-top: 15px;
}
h2 {
  padding-left: 40px;
  padding-right: 50px;
  opacity: 65%;
}
</style>