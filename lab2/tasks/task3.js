function task3(selector) {
  d3.select(selector)
    .append('div')
      .style('width', '100px')
      .style('height', '100px')
      .style('background-color', 'green')
      .on('mouseenter', function() {
        d3.select(this)
          .style('background-color', 'orange')
          .style('border', '5px dashed black');
      })
      .on('mouseleave', function() {
        d3.select(this)
          .style('background-color', 'steelblue')
          .style('border', '');
      });

  d3.select(selector)
    .append('p')
      .text('The element will change apperance when the mouse enters and exits.')
}


export { task3 }
