<!-- src/components/DataLoader.vue -->
<template>
    <div>
        <slot></slot>
    </div>
</template>
  
<script setup>
import { ref, defineEmits } from 'vue';
import * as d3 from 'd3';
const emit = defineEmits(['update:data']);

const loadData = async () => {
    try {

        const rawData = await d3.json('data/mtbs.json');
        // first 2000 data points
        const keys = Object.keys(rawData.mtbs_id).slice(0, 2000);
        // all data points
        // const keys = Object.keys(rawData.mtbs_id);

        const dataPoints = keys.map(index => ({
            id: parseInt(index),
            name: rawData.incident_name[index],
            lat: parseFloat(rawData.latitude[index]),
            lng: parseFloat(rawData.longitude[index]),
            acreage: parseFloat(rawData.burned_acreage[index]),
            date: rawData.ignition_date[index],
            year: parseInt(rawData.ignition_year[index]),
            month: parseInt(rawData.ignition_date[index].split('-')[1]),
        })).filter(dp => {
            // Northern California region
            const isNorth = dp.lat >= 39 && dp.lat <= 42 && dp.lng >= -124 && dp.lng <= -120;
            // Central California region
            const isCentral = dp.lat >= 35 && dp.lat <= 39 && dp.lng >= -124 && dp.lng <= (-1.375 * (dp.lat - 39) -120);
            // Southern California region
            const isSouth = dp.lat >= 32 && dp.lat <= 35 && dp.lng >= -124 && dp.lng <= -114;

            return isNorth || isCentral || isSouth;
        });
        return dataPoints;
    } catch (error) {
        console.error("Error loading data: ", error);
        return [];
    }
};

const dataPointsRef = ref([]);

loadData().then(dataPoints => {
    dataPointsRef.value = dataPoints;
    emit('update:data', dataPoints);
});

</script>