function task5(selector) {
  d3.select(selector)
    .append('div')
      .text('Hello world!')
      .style('color', 'green');
}

export { task5 }
