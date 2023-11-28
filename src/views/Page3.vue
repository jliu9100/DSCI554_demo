<!-- src/views/SubPage1.vue -->
<template>
  <DataLoader @update:data="handleDataUpdate" />
  <div v-loading.fullscreen.lock="isLoading1">
    <h1>{{ title }}</h1>


    <el-row>
      <el-col :span="8">
        <div v-if="dataPoints && dataPoints.length">
          <h2>{{ subtitle1 }}</h2>
          <Page3DensityMap :dataPoints="null" @loading="handleMapLoading" @loaded="handleMapLoaded" />
        </div>
      </el-col>

      <el-col :span="8">
        <div v-if="dataPoints && dataPoints.length">
          <h2>{{ subtitle1 }}</h2>
          <Page3DensityMap :dataPoints="null" @loading="handleMapLoading" @loaded="handleMapLoaded" />
        </div>
      </el-col>

      <el-col :span="8">
        <div v-if="dataPoints && dataPoints.length">
          <h2>{{ subtitle1 }}</h2>
          <Page3DensityMap :dataPoints="null" @loading="handleMapLoading" @loaded="handleMapLoaded" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import DataLoader from '@/components/DataLoader.vue';
import Page3DensityMap from '@/components/Page3DensityMap.vue';

const title = ref('Title');
const subtitle1 = ref('Empty Map');
const dataPoints = ref([]);
const isLoading1 = ref(true);

const handleDataUpdate = (updatedData) => {
  dataPoints.value = updatedData;
};

const handleMapLoading = () => {
    isLoading1.value = true;
};

const handleMapLoaded = () => {
    isLoading1.value = false;
};
</script>
  
<style></style>