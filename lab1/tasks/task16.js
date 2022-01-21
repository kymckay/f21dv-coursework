function task16(selector) {
  const data = [10, 15, 20, 25, 30];

  const sel = d3.select(selector)
    .append('svg')
      .attr('width', 600)
      .attr('height', 300)
    .selectAll('g')
      .data(data)
    .join('g');

  // Original circles chart
  sel.append('circle')
      .attr('cx',(d,i) => i * 100 + d * 2 + 5)
      .attr('cy', 100)
      .attr('r', d => d * 1.5)
      .attr('fill', (_,i) => ['blue', 'green', 'red', 'yellow', 'pink'][i]);

  sel.append('text')
      .attr('x', (d,i) => i * 100 + d * 2 + 5)
      .attr('y', 105)
      .attr('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .text(d => d);

  // Additional squares chart
  sel.append('rect')
      .attr('x',(d,i) => i * 100 + d * 0.5 + 5)
      .attr('y', d => 200 - d * 1.5)
      .attr('width', d => d * 3)
      .attr('height', d => d * 3)
      .attr('fill', (_,i) => ['blue', 'green', 'red', 'yellow', 'pink'][i]);

  sel.append('text')
      .attr('x', (d,i) => i * 100 + d * 2 + 5)
      .attr('y', 205)
      .attr('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .text(d => d);
}

export { task16 }
