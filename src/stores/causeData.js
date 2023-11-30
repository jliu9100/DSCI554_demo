import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import * as d3 from 'd3';

export const useCauseDataStore = defineStore('causeData', () => {
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const causeCount = ref(null);
  const causeLevelDataAll = ref(null);
  const causeYearlyDataAll = ref(null);

  async function loadData(url) {
    if (isLoaded.value) return;
    isLoading.value = true;
    [
      causeCount.value,
      causeLevelDataAll.value,
      causeYearlyDataAll.value
    ] = await Promise.all([
      d3.json('data/countByCause.json'),
      d3.json('data/countByCauseLevel.json'),
      d3.json('data/countByCauseYearly.json')
    ])
    isLoading.value = false;
    isLoaded.value = true;
  }
  return {
    causeCount,
    causeLevelDataAll,
    causeYearlyDataAll,
    isLoading,
    isLoaded,
    loadData
  }
});
