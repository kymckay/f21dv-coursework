function task13(selector) {
  const bars = d3.select(selector)
    .append('svg')
      .attr('width', 60)
      .attr('height', 100)
    .selectAll('rect')
      .data(d3.range(3))
    .join('rect')
      .attr('fill', 'blue')
      .attr('x', d => d*20)
      .attr('y', 0)
      .attr('height', 20)
      .attr('width', 10);

  d3.select(selector)
    .on('click', function() {
      bars.each(function(d) {
        d3.select(this)
          .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .delay(2000 * d)
            .attr('height', 100)
          .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attr('height', 10);
      });
    });

  d3.select(selector)
    .append('p')
      .text('On click, the bars will transition as before, then transition back.');
}

export { task13 }
