function task3(selector) {
  // Making required 10 div elements using join instead of
  // appending in a loop as requested for efficiency.
  const sel = d3.select(selector)
    .selectAll('div')
      .data(d3.range(10))
    .join('div')
      .text(d => d);

  // Also part of task 3, first 5 are red and last 5 are green.
  sel.filter((_,i) => i < 5).style('color', 'red');
  sel.filter((_,i) => i >= 5).style('color', 'green');
}

export { task3 }
