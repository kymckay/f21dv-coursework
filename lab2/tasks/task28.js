function task28(selector) {
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

    const colorScale = d3.scaleSequential(d3.interpolateRainbow)
      .domain([0, numNodes]);

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
          .attr('fill', (_,i) => colorScale(i))
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
      .text('Use the button to run a simple simulation.')
}

export { task28 }
