function task31(selector) {
  const width = 400
  const height = 400;

  // setup svg
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // generate some random data
  const numNodes = 100;
  const nodes = d3.range(numNodes)
    .map(() => ({radius: Math.random() * 25}))

  d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) {
        return d.radius
    }))
    .on('tick', ticked);

  function ticked() {
    svg.selectAll('circle')
        .data(nodes)
      .join(enter => enter.append('circle')
          // Add listeners and initial colour only once on append
          .attr('fill', 'blue')
          .on('mouseenter', function() {
            d3.select(this).attr('fill', 'orange');
          })
          .on('mouseleave', function() {
            d3.select(this).attr('fill', 'blue');
          })
        )
        .attr('r', d => d.radius)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
  }

  d3.select(selector)
    .append('p')
      .text('The elements are positoned by simulation as before, but change colour on hover.')
}

export { task31 }
