import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as d3 from 'd3';

export const useTimelapseDataStore = defineStore('timelapseData', () => {
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const data = ref(null);
  const dataByMonth = ref(null);
  const years = ref([]);
  const uniqueYears = ref(null);
  const acresBurned = ref(null);
  const maxIntraYearIndexByMonth = ref(null);

  async function loadData(url) {
    if (isLoaded.value) return;
    isLoading.value = true;
    [
      data.value,
      dataByMonth.value
    ] = await Promise.all([
      d3.json('timelapse.json'),
      d3.json('timelapse_by_month.json')]);
    years.value = data.value.map(d => d.year);
    uniqueYears.value = [...new Set(years.value)].sort(d3.ascending);
    acresBurned.value = data.value.map(d => d.acresBurned);
    maxIntraYearIndexByMonth.value = dataByMonth.value.map(
      monthList => Math.max(
        ...monthList.map(d => d.intraYearIndex)));
    isLoading.value = false;
    isLoaded.value = true;
  }
  return {
    isLoading,
    isLoaded,
    data,
    dataByMonth,
    years,
    uniqueYears,
    acresBurned,
    maxIntraYearIndexByMonth,
    loadData
  }
});
