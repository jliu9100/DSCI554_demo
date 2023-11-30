import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as d3 from 'd3';

export const usePackDataStore = defineStore('packData', () => {
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const data = ref(null);

  async function loadData(url) {
    if (isLoaded.value) return;
    isLoading.value = true;
    data.value = await d3.json('pack_burn_by_decade.json');
    isLoading.value = false;
    isLoaded.value = true;
  }
  return {
    data,
    isLoading,
    isLoaded,
    loadData
  }
});
