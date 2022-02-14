function task11(selector) {
  d3.select(selector)
    .append('svg')
      .attr('width', '200px')
      .attr('height', '200px')
    .append('text')
      .text('Colour')
      .attr('transform', 'translate(100,100)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16pt')
      .attr('fill', 'black')
    .on('mouseenter', function() {
      d3.select(this)
        .interrupt()
        .transition()
          .duration(2000)
          .ease(d3.easeQuad)
          .attr('fill', 'red')
          .attr('font-size', '32pt');
    })
    .on('mouseleave', function() {
      d3.select(this)
        .interrupt()
        .transition()
          .duration(2000)
          .ease(d3.easeQuad)
          .attr('fill', 'black')
          .attr('font-size', '16pt');
    });

  d3.select(selector)
    .append('p')
      .text('On hover, the SVG text element will transition in size and colour.');
}

export { task11 }
