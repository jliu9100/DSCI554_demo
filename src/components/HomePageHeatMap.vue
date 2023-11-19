<template>
    <div ref="chartContainer" class="home-page-heat-map"></div>
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
        createHeatMap(props.dataPoints);
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
        createHeatMap(props.dataPoints); // Redraw chart based on new size
    }
};

const createHeatMap = (data) => {
    // ... previous setup code ...
    const countsByYearMonth = d3.rollups(data,
        v => v.length, // This function counts the number of entries for each group
        d => d.year, d => d.month) // Grouping by year then by month
        .map(([year, months]) => {
            // Transform the sub-array of months into a map for easier access
            const monthCounts = new Map(months);
            return { year, months: monthCounts };
        })
        .sort((a, b) => b.year - a.year) // Sort by year descending
        .slice(0, 10); // Get the most recent ten years

    const years = countsByYearMonth.map(d => d.year);
    const margin = { top: 20, right: 20, bottom: 20, left: 30 },
        width = chartContainer.value.clientWidth /1.5 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    d3.select(chartContainer.value).selectAll("*").remove();

    svg.value = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', chartContainer.value.clientWidth)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);


    // Scales for the x-axis and y-axis
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const x = d3.scaleBand()
        .range([0, width])
        .domain(monthNames) // Use month names instead of numbers
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
        .attr("x", -margin.left)
        .attr("y", -10)
        .style("text-anchor", "start")
        .text("Year");

    // Color scale: more fires -> darker color
    const colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, d3.max(countsByYearMonth, d => d3.max(d.months.values()))])
        .range(["#00BFFF", "purple"]);

    const sizeScale = d3.scaleLinear()
        .domain([0, d3.max(countsByYearMonth, d => d3.max(d.months.values()))])
        .range([0, y.bandwidth()]);

    // Append the squares
    countsByYearMonth.forEach(yearEntry => {
        monthNames.forEach((month, index) => {
            const count = yearEntry.months.get(index + 1) || 0; // Get the count for the month, default to 0
            const size = sizeScale(count); // Calculate the size of the square
            const xPosition = x(month) + x.bandwidth() / 2 - size / 2; // Center the square in the x scale band
            const yPosition = y(yearEntry.year) + y.bandwidth() / 2 - size / 2; // Center the square in the y scale band

            svg.value.append('rect')
                .attr('x', xPosition)
                .attr('y', yPosition)
                .attr('width', size)
                .attr('height', size) // The height is now the same as the width to form a square
                .attr('fill', colorScale(count));
        });
    });

    const legendWidth = (width - margin.left - margin.right) / 2;
    const legendHeight = 20; // Height of the legend bar

    // Create a gradient for the legend's color range
    svg.value.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .selectAll("stop")
        .data(colorScale.range().map((color, i, range) => ({
            offset: `${100 * i / (range.length - 1)}%`, // Position stops from 0% to 100%
            color: color
        })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // Add the colored rectangle representing the legend
    const legend = svg.value.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + margin.left}, ${height - margin.top})`);

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)");

    // Add min and max text labels for the legend
    legend.append("text")
        .attr("x", 0)
        .attr("y", legendHeight + 5) // Position below the legend bar
        .attr("dy", "0.75em")
        .style("text-anchor", "start")
        .text(d3.min(colorScale.domain())); // Minimum value

    legend.append("text")
        .attr("x", legendWidth)
        .attr("y", legendHeight + 5) // Position below the legend bar
        .attr("dy", "0.75em")
        .style("text-anchor", "end")
        .text(d3.max(colorScale.domain())); // Maximum value
};


</script>



