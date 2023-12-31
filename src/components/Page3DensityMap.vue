<template>
    <div ref="californiaMap"></div>
</template>

<script setup>
import * as d3 from 'd3';

import { onMounted, ref, defineProps, defineEmits, onUnmounted } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    dataPoints: Array,
    mapType: String  // 新增属性
});

const emit = defineEmits(['loading', 'loaded']);
const californiaMap = ref(null);
let debounceTimer;

function debounce(func, delay) {
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

onMounted(() => {
    drawMap();
    const handleResizeDebounced = debounce(handleResize, 500);
    window.addEventListener('resize', handleResizeDebounced);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

function handleResize() {
    if (!californiaMap.value) {
        return;
    }
    d3.select(californiaMap.value).select('svg').remove();
    drawMap();
}

async function drawMap() {
    emit('loading');
    if (!californiaMap.value) {
        return;
    }
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const width = californiaMap.value.clientWidth - margin.left - margin.right || 500;
    const height = californiaMap.value.clientWidth - 200 + margin.top + margin.bottom || 500;

    const svg = d3.select(californiaMap.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator()
        .center([-120, 37])
        .scale(4 * width * 0.7)
        .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

  const rasterPatternId = props.mapType === 'map1' ? 'rasterPatternMap1' : 'rasterPatternMap2';

  const rasterImage = props.mapType === 'map1' ? 'density_gradient.png' : 'density_gradient_2015.png';

  svg.append('defs')
      .append('pattern')
      .attr('id', rasterPatternId)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', width)
      .attr('height', height)
      .append('image')
      .attr('xlink:href', rasterImage)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('class', 'raster-image');


  const geojsonData = await d3.json('data/CaliforniaCountyBoundaries.geojson');
    svg.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#000")
        .attr("fill", `url(#${rasterPatternId})`)
        .attr("stroke-width", 1);

    emit('loaded');
}

</script>

<style>


</style>