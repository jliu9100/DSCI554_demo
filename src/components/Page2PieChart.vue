<template>
    <div class="controls">
        <el-switch v-model="showAllTooltips" active-text="Boom!" ></el-switch>
        <el-alert title="Try click the BOOM! button or the arc of the pie chart" type="info" />
    </div>
    <div ref="chartContainer" class="chart"></div>
</template>

<script setup>
import * as d3 from 'd3';
import { round } from 'lodash';
import { ref, computed, defineProps, onMounted, onUnmounted, defineEmits, watchEffect } from 'vue';
const props = defineProps({
    dataPoints: Array,
});

const emit = defineEmits(['loading', 'loaded']);

const chartContainer = ref(null);
const showAllTooltips = ref(false);
const causeCount = ref([]);
const totalCount = computed(() => {
    return causeCount.value.reduce((acc, cur) => acc + cur.count, 0);
});

async function loadCauseCountData() {
    try {
        // 尝试从 cause.json 文件加载
        const response = await d3.json('data/countByCause.json');
        causeCount.value = response;
    } catch (error) {
        // 如果 cause.json 文件不存在
        const cachedData = sessionStorage.getItem('dataByCause');
        if (cachedData) {
            // 从 sessionStorage 加载
            causeCount.value = JSON.parse(cachedData);
        } else {
            // 计算数据并存储到 sessionStorage
            const countMap = new Map();
            props.dataPoints.forEach(point => {
                countMap.set(point.name, (countMap.get(point.name) || 0) + 1);
            });
            causeCount.value = Array.from(countMap, ([name, count]) => ({ name, count }));
            sessionStorage.setItem('dataByCause', JSON.stringify(causeCount.value));
        }
    }
}

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
    await loadCauseCountData();
    const handleResizeDebounced = debounce(handleResize, 100);
    window.addEventListener('resize', handleResizeDebounced);
    watchEffect(() => {
        if (chartContainer.value && causeCount.value.length > 0) {
            drawPieChart(causeCount.value, chartContainer.value);
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
    drawPieChart(causeCount.value, chartContainer.value);
}

function drawPieChart(data, container) {
    emit('loading');
    // 设置饼图的尺寸和边距
    const margin = { top: 100, right: 20, bottom: 20, left: 20 };
    const width = chartContainer.value.clientWidth / 2 - margin.left - margin.right;
    const height = chartContainer.value.clientWidth / 2 - margin.top - margin.bottom;

    // 创建 SVG 容器
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

    // 绘制每个饼图片段
    svg.append('g')
        .attr('transform', `translate(${width},${height / 2})`)
        .selectAll('path')
        .data(pie)
        .join('path')
        .attr('fill', d => color(d.data.name))
        .attr('d', arc)
        .on('click', (event, d) => {
            const clickedArc = d3.select(event.currentTarget);
            const isClicked = clickedArc.classed('clicked');
            
            if (!isClicked) {
                
                // resetClickedArcs();
                const [x, y] = arc.centroid(d);
                clickedArc.classed('clicked', true)
                    .transition()
                    .duration(200)
                    .attr('transform', `translate(${x * 0.1}, ${y * 0.1})`);

                // 显示气泡
                showTooltip(event, d.data);
                
            } else {
                console.log('hide')
                clickedArc.classed('clicked', false)
                    .transition()
                    .duration(200)
                    .attr('transform', '');
                hideTooltip();
            }
        });

    function resetClickedArcs() {
        svg.selectAll('path.clicked')
            .classed('clicked', false)
            .transition()
            .duration(200)
            .attr('transform', '');
        
    }

    const tooltip = d3.select(container)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip') // 使用这个类来应用样式
        .style('position', 'absolute')
        .style('pointer-events', 'none');

    function showTooltip(event, data) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
        tooltip.html(`<div class="tooltip-container"><div class="tooltip-title">${data.name}</div><div class="tooltip-content">Count: ${data.count}<br/>Percentage: ${round(data.count / totalCount.value * 100, 2)}%</div></div>`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px')

    }


    watchEffect(() => {
        const paths = svg.selectAll('path');

        if (showAllTooltips.value) {
            paths.each((d, i, nodes) => {
                const angle = d.endAngle - d.startAngle;
                const moveDistance = Math.max(0.004 /angle, 0.05);
                const [x, y] = arc.centroid(d);
                d3.select(nodes[i])
                    .attr('transform', `translate(${x * moveDistance}, ${y * moveDistance})`);
            });
        } else {
            svg.selectAll('path')
            .classed('clicked', false)
            .transition()
            .duration(200)
            .attr('transform', '');

            hideTooltip();
            console.log('reset')
        }
    });

    function hideTooltip() {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    }
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
</style>