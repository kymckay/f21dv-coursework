import { task14 } from './task14.js'

async function task15(selector) {
  const data = await task14(selector);

  data.barChart
    .selectAll('rect')
      .attr('fill', d => (d.count >= 100) ? 'red' : 'blue');

  d3.select(selector)
  .append('p')
    .text('Values over 100 shown in red.');
}

export { task15 }
