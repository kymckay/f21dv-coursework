function task29(selector) {
  const width = 400
  const height = 400;

  // setup svg
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const nodes = [
    {radius: 30},
    {radius: 12},
    {radius: 27},
    {radius: 22},
    {radius: 16},
    {radius: 10}
  ]

  function simulate() {
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
        .join('circle')
          .attr('fill', 'blue')
          .attr('r', d => d.radius)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
    }
  }

  d3.select(selector)
    .append('div')
    .append('button')
      .text('Apply simulation')
      .on('click', function() {
        simulate();
        d3.select(this).remove()
      });

  d3.select(selector)
    .append('p')
      .text('Use the button to run a simple simulation. Same as before but the data is not random.')
}

export { task29 }
