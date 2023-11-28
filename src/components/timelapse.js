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
  // .call(responsivefy);

  /* Add working region inside margins */
  const g = svg.append('g')
    .attr('transform',
      `translate(${margin.left}, ${margin.top})`);

  var sampleData = [
    {
      year: 2010,
      acresBurned: 100,
      intraYearIndex: 0
    },
    {
      year: 2010,
      acresBurned: 100,
      intraYearIndex: 1
    },
    {
      year: 2010,
      acresBurned: 100,
      intraYearIndex: 2
    },
    {
      year: 2010,
      acresBurned: 200,
      intraYearIndex: 3
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 0
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 1
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 2
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 3
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 4
    },
    {
      year: 2011,
      acresBurned: 150,
      intraYearIndex: 5
    },
    {
      year: 2011,
      acresBurned: 10,
      intraYearIndex: 6
    },
    {
      year: 2012,
      acresBurned: 10,
      intraYearIndex: 0
    },
    {
      year: 2012,
      acresBurned: 10,
      intraYearIndex: 1
    },
  ]

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
    .tickSize(0)
    .tickPadding(5)
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


  const monthGroup = svg.append('g')
    .attr('width', '200px')
    .attr('transform', 'translate(300, 100)');

  function drawMonths(selector, monthIndex) {
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const months = [
      allMonths[(monthIndex - 1 + 12) % 12],
      allMonths[monthIndex],
      allMonths[(monthIndex + 1) % 12]
    ]
    selector.selectAll('text')
      .data(months)
      .join('text')
      .text((d, i) => (i == 1) ? d : '')
      .attr('transform', (d, i) => 'translate(' + (i * 100) + ', 0)')
      .attr('font-weight', (d, i) => (i == 1) ? 'bold' : '100')
      .attr('font-size', (d, i) => (i == 1) ? '2em' : '1em')
  }

  var i = 4;

  function doThing() {
    // Draw months
    drawMonths(monthGroup, i)
  
    // Draw data points
    drawSmoke(g, data_by_month[i], width, height, x, xSubYear, y, yProportion);

    i = ((i + 1) % 12);
  }
  doThing();
  setInterval(doThing, 10000)

}