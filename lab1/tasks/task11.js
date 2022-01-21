function task11(selector) {
  const data = [
    {x: [100,300], y: [100,100], color: 'red'}, // top
    {x: [300,300], y: [100,300],  color: 'blue'} , // right
    {x: [300,100], y: [300,300], color: 'yellow'}, // bottom
    {x: [100,100], y: [300,100], color: 'orange'}, // left
  ];

  d3.select(selector)
  .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .style('border', '1px solid green')
  .selectAll('line')
    .data(data)
  .join('line')
    .attr('x1', d => d.x[0])
    .attr('x2', d => d.x[1])
    .attr('y1', d => d.y[0])
    .attr('y2', d => d.y[1])
    .attr('stroke', d => d.color);
}

export { task11 }
