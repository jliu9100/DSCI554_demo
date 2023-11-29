<template>
    <div ref="californiaMap"></div>
</template>

<script setup>
import * as d3 from 'd3';

import { onMounted, ref, defineProps, defineEmits, onUnmounted,watch } from 'vue';

const props = defineProps({
    dataPoints: Array,
    mapType: String,
    selectedCounty: String
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

    watch(() => props.selectedCounty, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            handleResize();
        }
    });
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
    const height = californiaMap.value.clientWidth - margin.top - margin.bottom || 500;

    const svg = d3.select(californiaMap.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator()
        .center([-120, 37])
        .scale(4 * width)
        .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
    const geojsonData = await d3.json('data/CaliforniaCountyBoundaries.geojson');

    let dataByCounty;

    const cachedData = props.mapType === 'sum' ? sessionStorage.getItem("acreageByCounty") : sessionStorage.getItem("countByCounty");
    if (cachedData) {
        dataByCounty = JSON.parse(cachedData);
    } else {
        try {
            if (props.mapType === 'sum') {
                dataByCounty = await d3.json('data/acreageByCounty.json');
                sessionStorage.setItem("acreageByCounty", JSON.stringify(dataByCounty));
            } else {
                dataByCounty = await d3.json('data/countByCounty.json');
                sessionStorage.setItem("countByCounty", JSON.stringify(dataByCounty));
            }


        } catch (error) {
            dataByCounty = {};
            if (props.mapType === 'sum') {
                for (const point of props.dataPoints) {

                    if (point.county) {
                        dataByCounty[point.county] = (dataByCounty[point.county] || 0) + point.acreage;
                        continue;
                    }
                    const county = getCountyFromLatLon(point.lat, point.lng, geojsonData);
                    if (county) {
                        dataByCounty[county] = (dataByCounty[county] || 0) + point.acreage;
                    }
                }
                sessionStorage.setItem("acreageByCounty", JSON.stringify(dataByCounty));
            } else {
                for (const point of props.dataPoints) {

                    if (point.county) {
                        dataByCounty[point.county] = (dataByCounty[point.county] || 0) + 1;
                        continue;
                    }
                    const county = getCountyFromLatLon(point.lat, point.lng, geojsonData);
                    if (county) {
                        dataByCounty[county] = (dataByCounty[county] || 0) + 1;
                    }
                }
                sessionStorage.setItem("countByCounty", JSON.stringify(dataByCounty));
            }


        }
    }
    const dataRange = d3.extent(Object.values(dataByCounty))
    const colorScale = props.mapType === 'sum' ? d3.scaleSequentialLog(d3.interpolateReds).domain(dataRange).base(1000) : d3.scaleSequential(d3.interpolateOranges).domain(dataRange);



    svg.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            const countyName = d.properties.CountyName;
            const acreage = dataByCounty[countyName] || 0;
            return colorScale(acreage);
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    const legendWidth = width - margin.left - margin.right;
    const legendHeight = 20;
    const legendPosition = { x: margin.left, y: height - legendHeight };
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`);

    const numRects = 10;
    const rectWidth = legendWidth / numRects;
    const quantizedColors = props.mapType === 'sum' ? d3.quantize(d3.interpolateReds, numRects) : d3.quantize(d3.interpolateOranges, numRects);
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
        .text(`${(d3.min(Object.values(dataByCounty)).toFixed(0))}`)

    legend.append("text")
        .attr("x", legendWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .text(`${(d3.median(Object.values(dataByCounty)).toFixed(0))}`)

    legend.append("text")
        .attr("x", legendWidth)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .text(`${(d3.max(Object.values(dataByCounty)).toFixed(0))}`)


    if (props.selectedCounty && dataByCounty[props.selectedCounty]) {
        console.log('selectedCounty', props.selectedCounty);
        const markerSize = 30;
        const countyCenter = getCenterOfCounty(props.selectedCounty, geojsonData);
        const [x, y] = projection([countyCenter.lon, countyCenter.lat]);
        svg.append('image')
            .attr('x', x - markerSize / 2)
            .attr('y', y - markerSize / 2)
            .attr('width', markerSize)
            .attr('height', markerSize)
            .attr('xlink:href', 'fire.png');
        //加上文字有name和acreage
        svg.append('text')
            .attr('x', x + markerSize / 2)
            .attr('y', y - markerSize / 2)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging')
            .text(`${props.selectedCounty}: ${dataByCounty[props.selectedCounty].toFixed(0)}`)
            .attr('fill', 'black')
            .attr('font-size', '24px');
    }

    emit('loaded');
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

function getCenterOfCounty(countyName, geojsonData) {
    const countyFeature = geojsonData.features.find(feature => feature.properties.CountyName === countyName);
    if (countyFeature) {
        const [lon, lat] = d3.geoCentroid(countyFeature);
        return { lon, lat };
    }
    return { lon: 0, lat: 0 };
}

// function getMarkerSize(dataByCounty, countyName) {
//     const value = dataByCounty[countyName];
//     const baseSize = 20;
//     return baseSize * Math.log(value + 1);
// }

</script>

<style></style>