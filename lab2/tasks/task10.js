function task10(selector) {
  d3.select(selector)
    .append('svg')
      .attr('width', '200px')
      .attr('height', '200px')
    .append('circle')
      .attr('cx', 100)
      .attr('cy', 100)
      .attr('r', 50)
      .attr('fill', 'red')
      .on('mouseenter', function() {
        d3.select(this)
          .interrupt()
          .transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr('r', 100);
      })
      .on('mouseleave', function() {
        d3.select(this)
        .interrupt()
        .transition()
          .duration(1000)
          .ease(d3.easeBounce)
          .attr('r', 50);
      });

  d3.select(selector)
  .append('p')
    .text('The circle will change size when the mouse enters and exits, with a "bounce" easing.')
}

export { task10 }
