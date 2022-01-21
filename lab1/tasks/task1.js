function task1(selector) {
  d3.select(selector)
    .append('p')
      .text(`d3.version: ${d3.version}`);
}

export { task1 }
