function task2(selector) {
  const data = ['blue', 'green', 'limegreen', 'yellow'];

  const div = d3.select(selector)
    .append('div')
      .style('display', 'flex')
      .style('flex-direction', 'row');

  // Add div elements with paragraphs inside, which will be shown on
  // hover using an appropriate CSS selector (see lab2.css)
  div.selectAll('div')
      .data(data)
    .join('div')
      .style('width', '200px')
      .style('height', '200px')
      .style('background-color', d => d)
      .style('display', 'inline-flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .classed('tooltip', true)
    .append('p')
      .text(d => d);

  d3.select(selector)
    .append('p')
      .text('Hover each block to see colour information.');
}

export { task2 }
