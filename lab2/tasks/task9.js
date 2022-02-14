function task9(selector) {
  const easeTypes = [d3.easeBounce, d3.easeSin, d3.easeCircle];

  const divs = d3.select(selector)
    .selectAll('div')
      .data(easeTypes)
    .join('div')
      .style('width',  '100px')
      .style('height', '100px')
      .style('background-color', 'blue')
      .style('transform', 'scale(1.0)');

  d3.select(selector)
    .on('click', function() {
      divs.each(function(d) {
        d3.select(this)
          .interrupt()
          .transition()
            .ease(d)
            .duration(1000)
            .style('background-color', 'red')
            .style('transform', 'scale(0.5)')
          .transition()
            .ease(d)
            .duration(1000)
            .style('background-color', 'blue')
            .style('transform', 'scale(1.0)');
      });
    });

  d3.select(selector)
    .append('p')
      .text('On click, the 3 elements will undergo the same transition with different easing functions.');
}

export { task9 }
