import * as d3 from 'd3';


function drawSmoke(selection, data, width, height, x, xSubYear, y, yProportion) {
  selection.selectAll('circle').remove();
  selection.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .transition()
    .duration(0)
    .delay((d, i) => d.intraYearIndex * 30)
    .attr('fill', 'red')
    .attr('r', d => d.acresBurned * 0.0001)
    .attr('cy', height - 5)
    .attr('cx', d => x(d.year) + xSubYear(Math.random()))
    .style('--height', d => y(d.acresBurned))
    .style('--height-proportion', d => yProportion(d.acresBurned))
    .attr('class', 'mooove')
}

export default async function timelapse(selector) {
  /* Create SVG */
  const margin = { top: 10, right: 30, bottom: 60, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  /* Add working region inside margins */
  const g = svg.append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`);

  const data = await d3.json('timelapse.json')
  const data_by_month = await d3.json('timelapse_by_month.json')

  // Reformat data
  const years = data.map(d => d.year)
  const uniqueYears = [...new Set(years)].sort(d3.ascending);
  const acresBurned = data.map(d => d.acresBurned);

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
    .attr('transform', 'translate(' + (margin.left / 2) + ',' + (margin.top + (height * 4 / 5)) + ') rotate(-90)')
    .text('# Acres Burned')
    .attr('class', 'axis-label')

  svg.append("svg:image")
    .attr('x', 100)
    .attr('y', -40)
    .attr('width', 600)
    .attr('height', 600)
    .attr("xlink:href", "smoke.png")

  const monthGroup = svg
    .append('foreignObject')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '100%')
    .attr('height', '100%')
    .append('xhtml:div')
    .attr('class', 'month-container')

  function drawMonth(selector, monthIndex) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[monthIndex];
    selector
      .html(`
      <p>${month}</p>
          `)
  }

  var i = 6;

  function doThing() {
    // Draw months
    drawMonth(monthGroup, i)

    // Draw data points
    drawSmoke(g, data_by_month[i], width, height, x, xSubYear, y, yProportion);

    i = ((i + 1) % 12);
  }
  doThing();
  setInterval(doThing, 10000)

}