function task5(selector) {
  const svg = d3.select(selector)
    .append('svg')
      .attr('width', '200px')
      .attr('height', '200px')
      .style('border', '5px solid black');

  const text = svg.append('text');

  svg.on('pointermove', function(event) {
    const [x, y] = d3.pointer(event);

    text.attr('x', x + 5)
        .attr('y', y)
        .text(`x: ${x}, y: ${y}`);
  })
  .on('pointerleave', () => text.text(''));

  d3.select(selector)
    .append('p')
      .text('On hover, a text element will follow the cursor.')
}

export { task5 }
