function task32(selector) {
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

  // This node will be controlled by the cursor
  nodes[0].radius = 25;
  nodes[0].fixed = true;

  function simulate() {
    const sim = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius))
      .on('tick', ticked);

    svg.on('mousemove', function(e) {
      const toMove = nodes[0];
      const [cx,cy] = d3.pointer(e);
      const ix = d3.interpolate(toMove.x, cx);
      const iy = d3.interpolate(toMove.y, cy);

      toMove.x = ix(0.4)
      toMove.y = iy(0.4)

      // Reheat the simulation for interaction
      sim.restart()
    })

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
      .text('Use the button to start an interactive simulation (use cursor to interact).')
}

export { task32 }
