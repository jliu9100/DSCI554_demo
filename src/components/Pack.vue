<template></template>
<script setup>
import { defineProps, onMounted, toRaw } from 'vue';
import { storeToRefs } from "pinia";
import * as d3 from 'd3';
import { usePackDataStore } from "@/stores/packData";

onMounted(async () => {
  const store = usePackDataStore();
  await store.loadData();
  let { data } = usePackDataStore();

  data = toRaw(data);

  const selector = '#pack-chart';

  const margin = { top: 10, right: 30, bottom: 60, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  const g = svg.append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`)

  const zoom = d3.zoom().on('zoom', e => {
    g.attr('transform', e.transform);
  });
  g.call(zoom)
    .call(zoom.transform, d3.zoomIdentity.translate(0, -30).scale(0.75));

  const hierarchy = d3.hierarchy(data)
    .sum(d => d.hasOwnProperty('acresBurned') ? d.acresBurned : 0);
  const root = d3.pack()
    .size([width, height])
    .padding(3)(hierarchy)

  // Add outer groups
  var outerNodeSelection = g.selectAll('g.outer')
    .data(root.children)
    .enter()
    .append('g')
    .attr('class', 'outer')
    .attr('id', d => 'outer-group-' + d.data.name);

  outerNodeSelection
    .append('circle')
    .attr('class', 'outer-circle')
    .attr('fill', 'red')
    .attr('r', d => d.r)
    .attr('opacity', 0.1)

  outerNodeSelection
    .append('text')
    .text(d => d.data.name)
    .attr('transform', d => {
      const leg = Math.sqrt(d.r * d.r / 2) + 5;
      return `translate(${-leg}, ${-leg})`
    })
    .style('font-weight', 'bold')
    .style('font-size', '2em')

  // Add simulations for decades
  var outerSimulation = d3
    .forceSimulation(root.children)
    .force('collide', d3.forceCollide(d => d.r).strength(1))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1))
    .on('tick', outerTick(outerNodeSelection))

  function outerTick(selection) {
    return (event) =>
      selection
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
  }

  outerNodeSelection.call(drag(outerSimulation, width, height));

  const tooltipSelection = g
    .append('foreignObject')

  for (const child of root.children) {
    var innerNodeSelection = outerNodeSelection
      .filter('#outer-group-' + child.data.name)
      .selectAll('g.inner')
      .data(child.children)
      .enter()
      .append('g')
      .attr('class', 'inner')
      .attr('id', d => 'inner-group-' + d.data.name);

    const innerCircleSelection = innerNodeSelection
      .append('circle')
      .attr('fill', 'blue')
      .attr('r', d => d.r)
      .attr('opacity', 0.1);

    innerCircleSelection
      .on('mouseover', (event, d) => {
        tooltipSelection
          .append('xhtml:div')
          .attr('class', 'tooltip-div')
          .html(`
            <p><b>Fire:</b> ${d.data.name}</p>
            <p><b>Acres burned:</b> ${d.data.acresBurned.toLocaleString('en-US')}</p>
          `)

        d3.select(event.target)
          .style("stroke", "black")
          .style("opacity", 1)
      })
      .on('mousemove', (event, d) => {
        const [x, y] = d3.pointer(event, g.node());
        tooltipSelection
          .attr('x', x + 20)
          .attr('y', y)
          .attr('width', '100%')
          .attr('height', '100%')
        // .attr('transform', `translate(${(x + 10)}, ${y})`)

      })
      .on('mouseleave', (event, d) => {
        tooltipSelection
          .html('')
        // .style("opacity", 0)
        d3.select(event.target)
          .style("stroke", "none")
          .style("opacity", 0.1)

      })

    // innerNodeSelection
    //   .append('text')
    //   .text(d => d.data.name)
    //   .attr('transform', d => {
    //     const leg = Math.sqrt(d.r * d.r / 2) + 5;
    //     return `translate(${-leg}, 0)`
    //   })
    //   .style('font-weight', 'bold')
    //   .style('font-size', '.3em')

    var innerSimulation = d3
      .forceSimulation(child.children)
      .force('collide', d3.forceCollide(d => d.r).strength(1))
      .force('x', d3.forceX(0).strength(0.1))
      .force('y', d3.forceY(0).strength(0.1))
      .force('boundiNParent', boundInParent(child.children))
      .on('tick', innerTick(innerNodeSelection))

    function boundInParent(nodes) {
      return alpha => {
        for (const d of nodes) {
          const innerCircleR = d.parent.r - d.r;
          d.x = Math.max(-innerCircleR, Math.min(innerCircleR, d.x));
          d.y = Math.max(-innerCircleR, Math.min(innerCircleR, d.y));
        }
      }
    }

    function innerTick(selection) {
      return (event) => selection
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    }

    innerNodeSelection.call(drag(innerSimulation, width, height));
  }

  function drag(simulation, width, height) {

    function onDragStart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function onDrag(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
    }

    function onDragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3
      .drag()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnded)
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }
});
</script>