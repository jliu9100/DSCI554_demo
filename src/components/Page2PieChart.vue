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
import { ref, computed, defineProps, onMounted, onUnmounted, defineEmits, watchEffect } from 'vue';
const props = defineProps({
    dataPoints: Array,
});

const emit = defineEmits(['loading', 'loaded']);

const chartContainer = ref(null);
const subContainer1 = ref(null);
const subContainer2 = ref(null);
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
        .on('click', async (event, d) => {
            const clickedArc = d3.select(event.currentTarget);
            const isClicked = clickedArc.classed('clicked');
            const causeName = d.data.name;

            const causeLevelData = await loadCauseData('countByCauseLevel.json', causeName);
            const causeYearlyData = await loadCauseData('countByCauseYearly.json', causeName);

            drawAdditionalPieChart(causeYearlyData, subContainer1);
            drawAdditionalPieChart(causeLevelData, subContainer2);

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
                clickedArc.classed('clicked', false)
                    .transition()
                    .duration(200)
                    .attr('transform', '');
                hideTooltip();
                d3.select(subContainer1.value).selectAll('*').remove();
                d3.select(subContainer2.value).selectAll('*').remove();
            }
        });

    async function loadCauseData(fileName, causeName) {
        try {
            // 加载原始数据
            const response = await d3.json(`data/${fileName}`);

            // 转换数据
            return response.map(item => {
                // 查找与 causeName 匹配的项目
                const causeItem = item.cause.find(c => c.name === causeName);
                // 返回新的结构，包含类别和计数
                return {
                    class: item.class ? item.class : item.year,
                    count: causeItem ? causeItem.count : 0 // 如果没有找到匹配项，计数为 0
                };
            });
        } catch (error) {
            console.error("Error loading data:", error);
            return []; // 在出错时返回空数组
        }
    }

    function drawAdditionalPieChart(data, containerRef) {
        // 首先，确定容器的尺寸
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = containerRef.value.clientWidth - margin.left - margin.right;
        const height = containerRef.value.clientWidth - margin.top - margin.bottom;
        const outerRadius = Math.min(width, height) / 2 - margin.top;

        // 清除容器内的内容
        d3.select(containerRef.value).selectAll('*').remove();

        // 创建 SVG 容器
        const svg = d3.select(containerRef.value)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);;

        // 创建饼图布局
        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);
        // 创建弧生成器
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(outerRadius);
        // 创建红色系比例尺
        let color;
        if (containerRef.value === subContainer2.value) {
            color = d3.scaleOrdinal()
                .domain(["A", "B", "C", "D", "E", "F", "G"])
                .range(["darkred", "red", "lightcoral", "salmon", "salmon", "lightpink", "pink"])
        } else {
            color = d3.scaleOrdinal(d3.schemeSpectral[11])
                .domain(data.map(d => d.class));
        }

        // 绘制饼图
        svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('fill', d => color(d.data.class))
            .attr('d', arc);

        // 可选：添加文本标签
        svg.selectAll('text')
            .data(pie(data))
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .text(d => {
                // 根据不同的类别返回不同的文本
                if (containerRef.value === subContainer1.value) {
                    return d.data.class
                } else {
                    switch (d.data.class) {
                        case 'A': return 'Critical';
                        case 'B': return 'Moderate';
                        case 'C': return 'Mild';
                        default: return ''; // 对于其他类别不显示文本
                    }

                }

            });
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
                const moveDistance = Math.max(0.004 / angle, 0.05);
                const [x, y] = arc.centroid(d);
                d3.select(nodes[i])
                    .attr('transform', `translate(${x * moveDistance}, ${y * moveDistance})`);


                const [labelX, labelY] = arc.centroid(d);
                const lineLength = 20; // 线的长度
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

.subChart1 {
    position: absolute;
    z-index: 0;
    top: 20vw;
    left: 5vw;
    width: 30%;
    /* 或根据需要调整 */
}

.subChart2 {
    position: absolute;
    z-index: 0;
    top: 20vw;
    right: 5vw;
    width: 30%;
    /* 或根据需要调整 */
}
</style>