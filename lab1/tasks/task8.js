function task8(selector) {
  const data = ['a', 4, 1, 'b', 6, 2, 8, 9, 'z'];

  d3.select(selector)
    .selectAll('span')
      .data(data)
    .join('span')
      .text(d => d)
      .style('color',
        d => (typeof(d) === 'string') ? 'blue' : 'green'
      );
}

export { task8 }
