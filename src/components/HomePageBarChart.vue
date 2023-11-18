<template>
    <div ref="chartContainer" class="chart-container">
    </div>
</template>
  
<script setup>
import { onMounted, onUnmounted, ref, defineProps } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
    dataPoints: Array
});

const chartContainer = ref(null);
const svg = ref(null);
onMounted(() => {

    if (chartContainer.value && props.dataPoints.length) {
        createChart(props.dataPoints);
        window.addEventListener('resize', handleResize);
    }

});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize); // Clean up resize listener
});

const handleResize = () => {
    if (svg.value) {
        // Remove the existing SVG to redraw it
        svg.value.remove();
        createChart(props.dataPoints); // Redraw chart based on new size
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
    console.log(dataByYear);

    const margin = { top: 10, right: 70, bottom: 40, left: 60 }
    const width = chartContainer.value.clientWidth - margin.left - margin.right; // Full width of the container
    const height = 200; // Example height or responsive height
    d3.select(chartContainer.value).selectAll("*").remove();

    // Append the svg object to the div called 'chartContainer'
    svg.value = d3.select(chartContainer.value)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    // .attr("viewBox", `0 0 ${width} ${height}`)

    // X axis
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

    // Add Y axis
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
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Fires"); 

    svg.value.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yLine).tickFormat(d => `${d / 1e6}M`)); // Convert to millions with "M" suffix

        svg.value.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", width + margin.right)
    .attr("x", 0 - (height / 2))
    .attr("dy", "-0.8em")
    .style("text-anchor", "middle")
    .text("Acres Burned");

    // Bars
    svg.value.selectAll(".bar")
        .data(dataByYear)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("y", d => yBar(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yBar(d.count))
        .attr("fill", "#69b3a2");

    // Line for the total acreage
    const line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2) // Center the line in the band
        .y(d => yLine(d.totalAcreage));

    svg.value.append("path")
        .datum(dataByYear)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
};
</script>
  
<style scoped>
.chart-container {
    /* Adjust styles as needed */
    width: 100%;
    height: 500px;
}
</style>
  