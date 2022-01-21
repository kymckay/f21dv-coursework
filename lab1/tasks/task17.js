function barChart(selector, data) {
  const width = 500;
  const barHeight = 20;
  const margin = 1;

  const scale = d3.scaleLinear()
    .domain(d3.extent(data))
    .range([50, 500]);

  // Wrap svg in a div for layout
  const div = d3.select(selector)
    .append('div');

  // Insert the new svg element (more calls adds multiple)
  const svg = div.append('svg')
      .attr('width', width)
      .attr('height', barHeight * data.length);

  const g = svg.selectAll('g')
      .data(data)
    .join('g')
      .attr('transform', (_,i) => `translate(0,${i * barHeight})`);

  const rects = g.append('rect')
      .attr('width', d => scale(d))
      .attr('fill', d => (d < 100) ? 'green' : ((d > 500) ? 'red' : 'blue'))
      .attr('height', barHeight - margin);

  g.append('text')
      .attr('x', d => scale(d))
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(d => d);

  return rects;
}

function task17(selector) {
  return barChart(selector, [50, 400, 300, 900, 250, 1000]);
}

export { barChart, task17 }
