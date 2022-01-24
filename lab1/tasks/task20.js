function task20(selector) {
  const width = 400;
  const height = 300;
  const margin = 50;

  const data = [10, 15, 20, 25, 30];

  const svg = d3.select(selector)
    .append('svg')
      .attr('width', width)
      .attr('height', height);

  const xscale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([margin, width - margin]);

  const yscale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height - margin, margin]);

  // Left axis
  svg.append('g')
      .attr('transform', `translate(${margin}, 0)`)
      .call(d3.axisLeft(yscale));

  // Bottom axis
  svg.append('g')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(d3.axisBottom(xscale));

  // Right axis
  svg.append('g')
      .attr('transform', `translate(${width - margin}, 0)`)
      .call(d3.axisRight(yscale))
      // Setting color works because generated svg tags use currentColor
      .style('color', 'blue');

  // Top axis
  svg.append('g')
      .attr('transform', `translate(0, ${margin})`)
      .call(d3.axisTop(xscale))
      .style('color', 'blue');
}

export { task20 }
