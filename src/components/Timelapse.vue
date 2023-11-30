<template></template>
<script setup>
import { defineProps, onMounted, toRaw } from 'vue';
import { storeToRefs } from "pinia";
import * as d3 from 'd3';
import { useTimelapseDataStore } from "@/stores/timelapseData";

onMounted(async () => {
  const store = useTimelapseDataStore();
  await store.loadData();
  let {
    data,
    dataByMonth,
    years,
    uniqueYears,
    acresBurned,
    maxIntraYearIndexByMonth,
  }
    = useTimelapseDataStore();
  // = storeToRefs(useTimelapseDataStore());

  data = toRaw(data);
  dataByMonth = toRaw(dataByMonth);
  years = toRaw(years);
  uniqueYears = toRaw(uniqueYears);
  acresBurned = toRaw(acresBurned);
  maxIntraYearIndexByMonth = toRaw(maxIntraYearIndexByMonth);


  // const props = defineProps({
  //   data: Array,
  //   dataByMonth: Array,
  //   years: Array,
  //   uniqueYears: Array,
  //   acresBurned: Number,
  //   maxIntraYearIndexByMonth: Array
  // })
  const selector = '#timelapse-chart';

  function drawSmoke(selection, data, width, height, x, xSubYear, y, yProportion, r) {
    selection.selectAll('circle').remove();
    selection.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .transition()
      .duration(0)
      .delay((d, i) => d.intraYearIndex * 30)
      .attr('fill', 'red')
      .attr('r', d => r(d.acresBurned))
      .attr('cy', height - 5)
      .attr('cx', d => x(d.year) + xSubYear(Math.random()))
      .style('--height', d => y(d.acresBurned))
      .style('--height-proportion', d => yProportion(d.acresBurned))
      .attr('class', 'mooove')
  }

  d3.select(selector).selectAll('svg').remove();
  const divWidth = document.querySelector('#timelapse-chart').clientWidth;
  const divHeight = 300;
  const margin = { top: 40, right: 80, bottom: 60, left: 150 },
    width = divWidth - margin.left - margin.right,
    height = divHeight - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  const g = svg.append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`);

  // Generate axial scales
  const x = d3.scalePoint(
    uniqueYears,
    [0, width]
  ).padding(0.5);
  const xSubYear = d3.scaleLinear(
    [0, 1],
    [-10, 10]
  )
  const y = d3.scaleLinear(
    [0, d3.max(acresBurned)],
    [0, height]
  );
  const yAxisScale = d3.scaleLinear(
    [0, d3.max(acresBurned)],
    [height, 0]
  );
  const yProportion = d3.scaleLinear(
    [0, d3.max(acresBurned)],
    [0, 1]
  );

  const r = d3.scaleSqrt(
    [0, d3.max(acresBurned)],
    [0, 75]
  )

  // Create x-axis
  const xAxis = d3.axisBottom(x)
    .tickPadding(5)
    .tickFormat(d => ((d % 5) == 0) ? d : '');

  g.append('g')
    .attr("class", "axis")
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
  svg.append('text')
    .attr('transform', 'translate(' + (margin.left + (width / 2) - 50) + ',' + (height + margin.top + margin.bottom) + ')')
    .text('Year')
    .attr('class', 'axis-label')

  // Create y-axis
  const yAxis = d3.axisLeft(yAxisScale)
    .tickSize(0)
    .tickPadding(5)
  g.append('g')
    .attr("class", "axis")
    .call(yAxis);
  svg.append('text')
    .attr('transform-box', 'fill-box')
    .attr('transform', 'translate(' + (margin.left / 3) + ',' + (divHeight - 50) + ') rotate(-90)')
    .text('Area Burned Per Fire (Acres)')
    .style('font-size', '15px')
    .attr('class', 'axis-label')
  // fontsize


  svg.append("svg:image")
    .attr('x', 100)
    .attr('y', -60)
    .attr('width', divWidth)
    .attr('height', divHeight)
    .attr("xlink:href", "smoke.png")

  const circles = [0.5, 2, 5].map(d => d * Math.pow(10, 5));
  const maxRadius = r(Math.max(...circles));
  const legend = svg
    .append('g')
    .style('transform', 'translate(1200px, 100px)')

  legend
    .append('rect')
    .attr('width', 400)
    .attr('height', maxRadius * 2 + 100)
    // .attr('stroke', 'black')
    .attr('fill-opacity', '0%')
    // .attr('transform', 'translate(-10, -90)')
    .attr("transform", `translate(${-margin.right}, ${-40})`);


  legend
    .append('text')
    .text('Acres')
    // .style('font-weight', 'bold')
    // .attr('transform', 'translate(243, 80)')
    .attr("transform", `translate(${margin.right + 60}, ${80})`);

  legend
    .append('text')
    .text('}')
    .style('font-size', '4rem')
    .style('font-weight', '1')
    .attr('opacity', '60%')
    .attr("transform", `translate(${margin.right + 30}, ${92})`);


  const leg = legend
    .append('g')
    // .attr('transform', 'translate(25, -40)')
    .attr("transform", `translate(${-margin.right}, ${-40})`);

  leg
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', r(100000))
    .attr('fill', 'red')
    .attr('stroke', 'black')
    .attr('fill-opacity', '10%')
    .attr('transform', 'translate(45, 0)')
  leg
    .append('text')
    .text('= 1 fire')
    .style('font-weight', 'bold')
    .attr('transform', 'translate(80, 5)')

  const leg2 = legend.append('g')
    .attr("transform", `translate(${-margin.right}, ${5})`);

  const legendGroups = leg2
    .selectAll('g')
    .data(circles)
    .join('g')

  legendGroups
    .append('circle')
    .attr('cx', maxRadius)
    .attr('cy', d => 2 * maxRadius - r(d))
    .attr('r', d => r(d))
    .attr('fill', 'red')
    .attr('stroke', 'black')
    // .attr('stroke-width', '5px')
    .attr('fill-opacity', '10%')

  const textStartX = (1.5 * maxRadius) + maxRadius;
  legendGroups
    .append('text')
    .text(d => d.toLocaleString('en-US'))
    .attr('x', textStartX)
    .attr('y', d => 2 * maxRadius - r(d) + 5)
    .attr('alignment-baseline', 'bottom')

  legendGroups
    .append('line')
    .attr('x1', d => r(d) + maxRadius)
    .attr('x2', textStartX)
    .attr('y1', d => 2 * maxRadius - r(d))
    .attr('y2', d => 2 * maxRadius - r(d))
    .attr('fill', 'blue')
    .attr('stroke', 'black')


  const monthGroup = svg
    .append('foreignObject')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', divWidth)
    .attr('height', divHeight)
    .append('xhtml:div')
    .attr('class', 'month-container')
    .style('height', '50px')
    // fontsize
    .style('font-size', '80px')


  function drawMonth(selector, monthIndex) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[monthIndex];
    selector
      .html(`
      <p style="height:100px">${month}</p>
          `)
  }

  function doThing(monthIndex) {
    // Draw months
    drawMonth(monthGroup, monthIndex)

    // Draw data points
    drawSmoke(g, dataByMonth[monthIndex], width, height, x, xSubYear, y, yProportion, r);

    const nextMonthIndex = ((monthIndex + 1) % 12);
    setTimeout(doThing.bind(null, nextMonthIndex), maxIntraYearIndexByMonth[monthIndex] * 40);
  }
  doThing(0);
});
</script>