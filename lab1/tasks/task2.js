// Use immediately invoked function to avoid polluting global scope
function task2(selector) {
  // Prepare indexed paragraph elements
  // Equivalent to elements already existing (as per task)
  const sel = d3.select(selector)
    .selectAll('div')
      .data(d3.range(2))
    .join('p')
      .text(d => `Paragraph ${d}`);

  // Demonstrate changing paragraph via select
  sel.select('p')
      .style('color', 'red')
      .style('font-family', 'Mono')
      .style('font-size', '18pt');
}

export { task2 }
