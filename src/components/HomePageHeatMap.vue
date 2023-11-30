<template>
    <div ref="chartContainer" class="home-page-heat-map"></div>
</template>
  
<script setup>
import { onMounted, onUnmounted, ref, defineProps, toRaw } from 'vue';
import * as d3 from 'd3';

import { useGeneralDataStore } from "@/stores/generalData";
let { data }  = useGeneralDataStore();
data = toRaw(data);


const chartContainer = ref(null);
const svg = ref(null);
onMounted(() => {

    if (chartContainer.value && data.length) {
        createHeatMap(data);
        window.addEventListener('resize', handleResize);
    }

});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize); 
});

const handleResize = () => {
    if (svg.value) {
        svg.value.remove();
        createHeatMap(data); 
    }
};

const createHeatMap = (data) => {
    const countsByYearMonth = d3.rollups(data,
        v => v.length, 
        d => d.year, d => d.month) 
        .map(([year, months]) => {
            const monthCounts = new Map(months);
            return { year, months: monthCounts };
        })
        .sort((a, b) => b.year - a.year) 
        .slice(0, 11); 

    const years = countsByYearMonth.map(d => d.year);
    const margin = { top: 20, right: 20, bottom: 20, left: 50 },
        width = chartContainer.value.clientWidth /1.5 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    d3.select(chartContainer.value).selectAll("*").remove();

    svg.value = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', chartContainer.value.clientWidth)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const x = d3.scaleBand()
        .range([0, width])
        .domain(monthNames) 
        .padding(0.05);

    svg.value.append("g")
        .attr("transform", `translate(0,0)`)
        .call(d3.axisTop(x))
        .selectAll(".tick line, .domain").remove();

    const y = d3.scaleBand()
        .range([0, height])
        .domain(years)
        .padding(0.05);

    svg.value.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

    svg.value.append("text")
        .attr("x", -30)
        .attr("y", -10)
        .style("text-anchor", "start")
        .text("Year");

    const colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([d3.min(countsByYearMonth, d => d3.min(d.months.values())), d3.max(countsByYearMonth, d => d3.max(d.months.values()))])
        .range(["yellow", "Crimson"]);

        const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(countsByYearMonth, d => d3.max(d.months.values()))])
    .range([0, y.bandwidth() / 1.5]);

    countsByYearMonth.forEach(yearEntry => {
        monthNames.forEach((month, index) => {
            const count = yearEntry.months.get(index + 1) || 0; 
            const size = sizeScale(count); 
            const xPosition = x(month) + x.bandwidth() / 2 - size / 2; 
            const yPosition = y(yearEntry.year) + y.bandwidth() / 2 - size / 2; 

            svg.value.append('rect')
                .attr('x', xPosition)
                .attr('y', yPosition)
                .attr('width', size)
                .attr('height', size) 
                .attr('fill', colorScale(count));
        });
    });

    const legendWidth = (width - margin.left - margin.right) / 2;
    const legendHeight = 20; 

    svg.value.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .selectAll("stop")
        .data(colorScale.range().map((color, i, range) => ({
            offset: `${100 * i / (range.length - 1)}%`, 
            color: color
        })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    const legend = svg.value.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + margin.left}, ${height - margin.top})`);

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)");

    legend.append("text")
        .attr("x", 0)
        .attr("y", legendHeight + 5) 
        .attr("dy", "0.75em")
        .style("text-anchor", "middle")
        .text("0");

    legend.append("text")
        .attr("x", legendWidth)
        .attr("y", legendHeight + 5) 
        .attr("dy", "0.75em")
        .style("text-anchor", "middle")
        .text(d3.max(colorScale.domain()));
};


</script>



