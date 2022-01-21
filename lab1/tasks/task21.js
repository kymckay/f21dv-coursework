import { task14 } from './task14.js'

async function task21(selector) {
  const { barChart, xAxis, yAxis, height } = await task14(selector);

  // Construct the x-axis and y-axis from the chart scales
  barChart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis));

  barChart.append('g')
    .call(d3.axisLeft(yAxis));
}

export { task21 }
