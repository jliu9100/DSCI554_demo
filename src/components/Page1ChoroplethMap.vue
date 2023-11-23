<template>
    <div ref="californiaMap" class="map-container"></div>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, ref, defineProps } from 'vue';

const props = defineProps({
    dataPoints: Array
});

const californiaMap = ref(null);

onMounted(() => {
    drawMap();
});

async function drawMap() {
    const width = californiaMap.value.clientWidth / 2;
    const height = 700;

    const svg = d3.select(californiaMap.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator()
        .center([-120, 37])
        .scale(2000)
        .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
    const geojsonData = await d3.json('data/CaliforniaCountyBoundaries.geojson');

    let acreageByCounty;
    const cachedData = sessionStorage.getItem("acreageByCounty");
    if (cachedData) {
        acreageByCounty = JSON.parse(cachedData);
    } else {
        try {
            acreageByCounty = await d3.json('data/acreageByCounty.json');
            sessionStorage.setItem("acreageByCounty", JSON.stringify(acreageByCounty));
        } catch (error) {
            acreageByCounty = {};
            for (const point of props.dataPoints) {
                const county = getCountyFromLatLon(point.lat, point.lng, geojsonData);
                if (county) {
                    acreageByCounty[county] = (acreageByCounty[county] || 0) + point.acreage;
                }
            }
            sessionStorage.setItem("acreageByCounty", JSON.stringify(acreageByCounty));
        }
    }
    const dataRange = d3.extent(Object.values(acreageByCounty))
    const colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain(dataRange);

    svg.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            const countyName = d.properties.CountyName;
            const acreage = acreageByCounty[countyName] || 0;
            return colorScale(acreage);
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    const legendWidth = 300;
    const legendHeight = 20;
    const legendPosition = { x: width / 2 - 100, y: height - 50 };
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`);

    const numRects = 10;
    const rectWidth = legendWidth / numRects;
    const quantizedColors = d3.quantize(d3.interpolateReds, numRects);
    quantizedColors.forEach((color, i) => {
        legend.append("rect")
            .attr("x", i * rectWidth)
            .attr("width", rectWidth)
            .attr("height", legendHeight)
            .attr("fill", color);
    });

    legend.append("text")
    .attr("x", 0)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .text(`${(d3.min(Object.values(acreageByCounty)) / 1000).toFixed(0)}k`);

legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .text(`${(d3.median(Object.values(acreageByCounty)) / 1000).toFixed(0)}k`);

legend.append("text")
    .attr("x", legendWidth)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .text(`${(d3.max(Object.values(acreageByCounty)) / 1000).toFixed(0)}k`);

}

function getCountyFromLatLon(lat, lon, geojsonData) {

    const point = [lon, lat];
    const county = geojsonData.features.find(feature => {
        if (feature.geometry.type === 'Polygon') {
            return d3.geoContains(feature.geometry, point);
        } else if (feature.geometry.type === 'MultiPolygon') {
            return feature.geometry.coordinates.some(polygon => {
                return d3.geoContains({ type: 'Polygon', coordinates: polygon }, point);
            });
        }

        return false;
    });

    return county ? county.properties.CountyName : null;
}
</script>

<style>
.map-container {
    width: 100%;
    height: 500px;
}
</style>