import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as d3 from 'd3';

export const useGeneralDataStore = defineStore('generalData', () => {
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const data = ref(null);

  const loadData = async () => {
    if (isLoaded.value) return;
    isLoading.value = true;
    try {
      const rawData = await d3.json('data/CA_Fires.json');
      // first 10000 data points
      // const keys = rawData.slice(0, 10000);
      // all data points
      const keys = rawData;

      const dataPoints = keys
        .filter(data => data.ignition_year && data.ignition_day)
        .map(data => {
          const date = new Date(data.ignition_year, 0);
          date.setDate(date.getDate() + data.ignition_day - 1);
          const month = date.getMonth() + 1;

          return {
            id: data.oid,
            name: data.cause_description,
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            acreage: parseFloat(data.fire_size),
            date: data.ignition_year,
            year: parseInt(data.ignition_year),
            month: month,
            county: data.county
          }
        }).filter(dp => {
          const isNorth = dp.lat >= 39 && dp.lat <= 42 && dp.lng >= -124 && dp.lng <= -120;
          const isCentral = dp.lat >= 35 && dp.lat <= 39 && dp.lng >= -124 && dp.lng <= (-1.375 * (dp.lat - 39) - 120);
          const isSouth = dp.lat >= 32 && dp.lat <= 35 && dp.lng >= -124 && dp.lng <= -114;

          return isNorth || isCentral || isSouth;
        });
      data.value = dataPoints;
    } catch (error) {
      console.error("Error loading data: ", error);
      data.value = [];
    }
    isLoading.value = false;
    isLoaded.value = true;
  };

  return {
    data,
    isLoading,
    isLoaded,
    loadData
  }
});
