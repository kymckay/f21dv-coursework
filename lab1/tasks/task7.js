function task7(selector) {
  const data = [10, 50, 60, 75, 100, 200];

  d3.select(selector)
    .selectAll('div')
      .data(data)
    .join('div')
      .text(d => `cont:${d}`)
      .style('color',
        d => (d >= 100) ? 'blue' : ((d > 50) ? 'red' : 'yellow')
      );
}

export { task7 }
