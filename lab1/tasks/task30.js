function task30(selector) {
  const data = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const xSize  = 400;
  const ySize  = 400;

  const svg = d3.select(selector)
    .append('svg')
      .attr('width',  xSize)
      .attr('height', ySize)
    .append('g')
      .attr('transform', `translate(${xSize/2},${ySize/2})`);

  const radius = Math.min(xSize, ySize) / 2;

  const color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet3);

  // Generate the pie
  const pie = d3.pie();

  // Generate the arcs
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Generate groups
  const arcs = svg.selectAll('arc')
      .data(pie(data))
    .join('g')
      .attr('class', 'arc');

  // Draw arc paths
  arcs.append('path')
      .attr('fill', (_,i) => color(i))
      .attr('d', arcGenerator);

  return {arcs, arcGenerator};
}

export { task30 }
