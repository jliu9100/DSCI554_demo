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

        const rawData = await d3.json('data/CA_Fires.json');
        // first 10000 data points
        // const keys = rawData.slice(0, 10000);
        // all data points
        // const keys = rawData.slice(0, 1000);
        const keys = rawData;

        const dataPoints = keys
        .filter(data => data.ignition_year && data.ignition_day)
        .map(data => {
            const date = new Date(data.ignition_year, 0); // 创建一个日期对象，设置为当年的1月1日
            date.setDate(date.getDate() + data.ignition_day - 1); // 加上年中的天数
            const month = date.getMonth() + 1; // getMonth() 返回的月份是从0开始计数的，所以需要加1
            
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