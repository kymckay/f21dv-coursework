function task6(selector) {
  d3.select(selector)
    .append('div')
      .style('width',  '100px')
      .style('height', '100px')
      .style('background-color', 'blue')
    .on('click', function() {
      d3.select(this)
        .interrupt()
        .transition()
          .duration(1000)
          .style('background-color', 'red')
        .transition()
          .duration(2000)
          .style('background-color', 'green')
        .transition()
          .duration(1000)
          .style('background-color', 'blue');
    });

  d3.select(selector)
    .append('p')
      .text('On click, the element will transition to red, then green and back to blue.')
}

export { task6 }
