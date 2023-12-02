<template>
  <div class="pieContainer">
    <div class="controls">
      <el-switch v-model="showAllTooltips" active-text="Boom!"></el-switch>
      <el-alert title="Try click the BOOM! button or the arc of the pie chart" type="info" />
    </div>
    <div ref="subContainer1" class="subChart1"></div>
    <div ref="chartContainer"></div>
    <div ref="subContainer2" class="subChart2"></div>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { round } from 'lodash';
import { ref, computed, defineProps, onMounted, onUnmounted, defineEmits, watchEffect, toRaw } from 'vue';
import { useCauseDataStore } from "@/stores/causeData";
import { useGeneralDataStore } from "@/stores/generalData";
const props = defineProps({
  dataPoints: Array,
});

let { data } = useGeneralDataStore();
let { causeCount, causeLevelDataAll, causeYearlyDataAll } = useCauseDataStore();
data = toRaw(data);
causeCount = toRaw(causeCount);
causeLevelDataAll = toRaw(causeLevelDataAll);
causeYearlyDataAll = toRaw(causeYearlyDataAll);


const emit = defineEmits(['loading', 'loaded']);

const chartContainer = ref(null);
const subContainer1 = ref(null);
const subContainer2 = ref(null);
const showAllTooltips = ref(false);
const totalCount = causeCount.reduce((acc, cur) => acc + cur.count, 0);

let debounceTimer;

function debounce(func, delay) {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}

onMounted(async () => {
  const handleResizeDebounced = debounce(handleResize, 100);
  window.addEventListener('resize', handleResizeDebounced);
  watchEffect(() => {
    if (chartContainer.value && causeCount.length > 0) {
      drawPieChart(causeCount, chartContainer.value);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  if (!chartContainer.value) {
    return;
  }
  d3.select(chartContainer.value).select('svg').remove();
  drawPieChart(causeCount, chartContainer.value);
}

function drawPieChart(data, container) {
  emit('loading');
  const margin = { top: 100, right: 20, bottom: 20, left: 20 };
  const width = chartContainer.value.clientWidth / 2 - margin.left - margin.right;
  const height = chartContainer.value.clientWidth / 2 - margin.top - margin.bottom;
  const svg = d3.select(container)
    .append('svg')
    .attr('class', 'chart-container')
    .attr('width', "100%")
    .attr('height', height);

  const pie = d3.pie()
    .value(d => d.count)(data);

  const outerRadius = Math.min(width, height) / 2 - margin.top;
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(outerRadius);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

  svg.append('g')
    .attr('transform', `translate(${width},${height / 2})`)
    .selectAll('path')
    .data(pie)
    .join('path')
    .attr('fill', d => color(d.data.name))
    .attr('d', arc)
    .attr('class', d => d.data.name)
    .on('click', async (event, d) => {
      const clickedArc = d3.select(event.currentTarget);
      const isClicked = clickedArc.classed('clicked');
      const causeName = d.data.name;

      const causeLevelData = loadCauseData(causeLevelDataAll, causeName);
      const causeYearlyData = loadCauseData(causeYearlyDataAll, causeName);

      drawAdditionalPieChart(causeYearlyData, subContainer1);
      drawAdditionalPieChart(causeLevelData, subContainer2);

      if (!isClicked) {

        // resetClickedArcs();
        const [x, y] = arc.centroid(d);
        clickedArc.classed('clicked', true)
          .transition()
          .duration(200)
          .attr('transform', `translate(${x * 0.1}, ${y * 0.1})`);
        showTooltip(event, d.data);

      } else {
        clickedArc.classed('clicked', false)
          .transition()
          .duration(200)
          .attr('transform', '');
        hideTooltip();
        d3.select(subContainer1.value).selectAll('*').remove();
        d3.select(subContainer2.value).selectAll('*').remove();
      }
    });
    // .dispatch('click');

  function loadCauseData(data, causeName) {
    return data.map(item => {
      const causeItem = item.cause.find(c => c.name === causeName);
      return {
        class: item.class ? item.class : item.year,
        count: causeItem ? causeItem.count : 0
      };
    });
  }

  function drawAdditionalPieChart(data, containerRef) {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = containerRef.value.clientWidth - margin.left - margin.right;
    const height = containerRef.value.clientWidth - margin.top - margin.bottom;
    const outerRadius = Math.min(width, height) / 2 - margin.top;

    d3.select(containerRef.value).selectAll('*').remove();
    const svg = d3.select(containerRef.value)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);;
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(outerRadius);
    let color;
    if (containerRef.value === subContainer2.value) {
      color = d3.scaleOrdinal()
        .domain(["A", "B", "C", "D", "E", "F", "G"])
        .range(["darkred", "red", "lightcoral", "salmon", "salmon", "lightpink", "pink"])
    } else {
      color = d3.scaleOrdinal(d3.schemeSpectral[11])
        .domain(data.map(d => d.class));
    }
    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('fill', d => color(d.data.class))
      .attr('d', arc);
    svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .text(d => {
        if (containerRef.value === subContainer1.value) {
          return d.data.class
        } else {
          switch (d.data.class) {
            case 'A': return 'Critical';
            case 'B': return 'Moderate';
            case 'C': return 'Mild';
            default: return '';
          }

        }

      });
  }
  const tooltip = d3.select(container)
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none');

  function showTooltip(event, data) {
    let [x, y] = d3.pointer(event, d3.select(container).node());
    if (isNaN(x)) {
      x = 550;
      y = 200;
    }
    console.log(x, y);
    tooltip.transition()
      .duration(200)
      .style('opacity', 1);
    tooltip.html(`<div class="tooltip-container"><div class="tooltip-title">${data.name}</div><div class="tooltip-content">Count: ${data.count}<br/>Percentage: ${round(data.count / totalCount.value * 100, 2)}%</div></div>`)
      .style('left', (x + 10) + 'px')
      .style('top', (y + 10) + 'px')

  }


  watchEffect(() => {
    const paths = svg.selectAll('path');

    if (showAllTooltips.value) {
      paths.each((d, i, nodes) => {
        const angle = d.endAngle - d.startAngle;
        const moveDistance = Math.max(0.004 / angle, 0.05);
        const [x, y] = arc.centroid(d);
        d3.select(nodes[i])
          .attr('transform', `translate(${x * moveDistance}, ${y * moveDistance})`);


        const [labelX, labelY] = arc.centroid(d);
        const lineLength = 20;
        const midAngle = (d.startAngle + d.endAngle) / 2;
        const textAnchor = midAngle < Math.PI ? 'start' : 'end';

        svg.append('line')
          .attr('x1', labelX * 2)
          .attr('y1', labelY * 2)
          .attr('x2', labelX * 2 + (textAnchor === 'start' ? lineLength : -lineLength))
          .attr('y2', labelY * 2)
          .attr('transform', `translate(${width},${height / 2 - (d.data.count < 560 ? 5 : 0) - (d.data.count < 200 ? 15 : 0) - (d.data.count < 140 ? 20 : 0) - (d.data.count < 80 ? 20 : 0)})`)
          .attr('stroke', 'black')
          .attr('class', 'label-line');

        svg.append('text')
          .attr('x', labelX * 2 + (textAnchor === 'start' ? lineLength : -lineLength))
          .attr('y', labelY * 2)
          .attr('transform', `translate(${width},${height / 2 - (d.data.count < 560 ? 5 : 0) - (d.data.count < 200 ? 15 : 0) - (d.data.count < 140 ? 20 : 0) - (d.data.count < 80 ? 20 : 0)})`)
          .attr('dy', '.35em')
          .style('text-anchor', textAnchor)
          .text(d.data.name)
          .attr('class', 'label-text');
      });


    } else {
      svg.selectAll('path')
        .classed('clicked', false)
        .transition()
        .duration(200)
        .attr('transform', '');

      hideTooltip();
      svg.selectAll('.label-line').remove();
      svg.selectAll('.label-text').remove();
      d3.select(subContainer1.value).selectAll('*').remove();
      d3.select(subContainer2.value).selectAll('*').remove();
    }
  });

  function hideTooltip() {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  }
  console.log(svg.select('.Miscellaneous').dispatch('click'))
  emit('loaded');
}




</script>

<style>
.tooltip-container {
  border: 1px solid black;
  background-color: white;
  padding: 0.5rem;
}

.tooltip-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subChart1 {
  position: absolute;
  z-index: 0;
  top: 20vw;
  left: 5vw;
  width: 30%;
}

.subChart2 {
  position: absolute;
  z-index: 0;
  top: 20vw;
  right: 5vw;
  width: 30%;
}

.controls {
  margin-left: 40px;
  width: 30vw;
}
</style>