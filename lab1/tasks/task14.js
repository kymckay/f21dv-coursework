import { taskData } from './task10.js'

async function task14(selector) {
  const data = await taskData();

  // Prepare svg area for bar chart
  const margin = { left: 60, right: 30, top: 30, bottom: 60 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const barChart = d3.select(selector)
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Get scaling for each axis
  const xAxis = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.name))
    .padding(0.2);

  const yAxis = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 170]);

  // Construct the data bars
  barChart.selectAll('rect')
      .data(data)
    .join('rect')
      .attr('x', d => xAxis(d.name))
      .attr('y', d => yAxis(d.count))
      .attr('width', xAxis.bandwidth())
      .attr('height', d => height - yAxis(d.count))
      .attr('fill', d => (d.count >= 100) ? 'red' : 'blue');

  return { barChart, xAxis, yAxis };
}

export { task14 }
