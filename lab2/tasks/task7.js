function task7(selector) {
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
          .style('width', '50px')
          .style('height', '50px')
        .transition()
          .duration(2000)
          .style('background-color', 'green')
          .style('width', '200px')
          .style('height', '200px')
        .transition()
          .duration(1000)
          .style('background-color', 'blue')
          .style('width', '100px')
          .style('height', '100px');
    });

  d3.select(selector)
    .append('p')
      .text('On click, the element will transition colour as before, but also size.')
}

export { task7 }
