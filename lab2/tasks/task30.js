function task30(selector) {
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
          .on('mouseenter', function() {
            const data = d3.select(this).datum();
            const radius = data.radius.toFixed(2)
            svg.append('rect')
              .classed('hint', true)
              .attr('x', data.x - 100)
              .attr('y', data.y - 60)
              .attr('width', 200)
              .attr('height', 40)
              .attr('fill', 'white');
            svg.append('text')
              .classed('hint', true)
              .attr('x', data.x)
              .attr('y', data.y - 40)
              .attr('text-anchor', 'middle')
              .text(`${radius}px radius`);
          })
          .on('mouseleave', () => {
            svg.selectAll('.hint').remove();
          })
        )
        .attr('fill', 'blue')
        .attr('r', d => d.radius)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
  }

  d3.select(selector)
    .append('p')
      .text('The elements are positoned by simulation as before, but show information on hover.')
}

export { task30 }
