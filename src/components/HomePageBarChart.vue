<template>
    <div ref="chartContainer" class="chart-container">
    </div>
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
        createChart(data);
        window.addEventListener('resize', handleResize);
    }

});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
    if (svg.value) {
        svg.value.remove();
        createChart(data);
    }
};

const createChart = (data) => {
    const dataByYear = d3.groups(data, d => d.year)
        .map(([year, values]) => {
            return {
                year,
                totalAcreage: d3.sum(values, d => d.acreage),
                count: values.length
            };
        });

    const margin = { top: 30, right: 90, bottom: 40, left: 150 }
    const width = chartContainer.value.clientWidth - margin.left - margin.right;
    const height = 200;
    d3.select(chartContainer.value).selectAll("*").remove();

    svg.value = d3.select(chartContainer.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(dataByYear.map(d => d.year))
        .range([0, width])
        .padding(0.2);

    svg.value.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .attr("y", -3);

    const yBar = d3.scaleLinear()
        .domain([0, d3.max(dataByYear, d => d.count) + 10])
        .range([height, 0]);
    const yLine = d3.scaleLinear()
        .domain([0, d3.max(dataByYear, d => d.totalAcreage) + 1e6])
        .range([height, 0])
        .nice();

    svg.value.append("g")
        .call(d3.axisLeft(yBar));

    svg.value.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 100)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('font-size', '15px')
        .style("font-weight", "bold")
        .text("Number of Fires");

    svg.value.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yLine).tickFormat(d => `${d / 1e6}M`));

    svg.value.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "-0.8em")
        
        .style("text-anchor", "middle")
        .style('font-size', '15px')
        .style("font-weight", "bold")
        .text("Cumulative Fire Size");

    svg.value.selectAll(".bar")
        .data(dataByYear)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("y", d => yBar(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yBar(d.count))
        .attr("fill", "var(--theme-color)");

    svg.value.selectAll(".bar-text")
        .data(dataByYear)
        .join("text")
        .attr("class", "bar-text")
        .attr("x", d => x(d.year) + x.bandwidth() / 2) 
        .attr("y", d => yBar(d.count) - 5) 
        .attr("text-anchor", "middle") 
        .text(d => d.count) 
        .attr("fill", "black") 
        .attr("font-size", "10px"); 
        
    const line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => yLine(d.totalAcreage));

    svg.value.append("path")
        .datum(dataByYear)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("stroke", "var(--theme-color-deep)");

    const legend = svg.value.append("g")
        .attr("transform", `translate(${width - 350}, ${0})`);
    legend.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke", "var(--theme-color-deep)")
        ;

    legend.append("text")
        .attr("x", 25)
        .attr("y", 0)
        .attr("dy", "0.32em")
        .text("Cumulative Fire Size");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 15)
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", "var(--theme-color)");

    legend.append("text")
        .attr("x", 25)
        .attr("y", 20)
        .attr("dy", "0.32em")
        .text("Number of Fires");
};
</script>
  
<style scoped>
.chart-container {
    width: 100%;
    height: 300px;
}
</style>
  