function task23(selector) {

  const data1 = [
    {x: 10, y: 20},
    {x: 12, y: 15},
    {x: 15, y: 24},
    {x: 18, y: 30},
    {x: 25, y: 20},
  ];

  const data2 = [
    {x: 1, y: 60},
    {x: 12, y: 20},
    {x: 20, y: 50},
    {x: 50, y: 45},
    {x: 70, y: 133},
  ];

  // set the dimensions and margins of the graph
  const margin = {top: 30, right: 30, bottom: 70, left: 60};
  const width  = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(selector)
    .append('div')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Axis elements, updated later on events
  svg.append('g').classed('bottom', true)
    .attr('transform', `translate(0,${height})`);

  svg.append('g').classed('left', true);

  // The line element to transition between data sets
  const path = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5);

  // The domain is up to the number of data sets since the scale
  // wraps back around to the same colour
  const colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0,2]);

  // A function that create / update the plot for a given variable:
  function update(data, index) {
    // Update x axis
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, width]);

    svg.select('.bottom')
      .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    // Update y axis
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([height, 0]);

    svg.select('.left')
      .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    // Update bars, fase in on enter, fade out on removal
    // Use group as key in case data is unordered
    path.datum(data)
      .transition()
        .duration(1000)
        .attr('stroke', colorScale(index))
        .attr('d',
          d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
        );
  }
  update(data1, 0);

  d3.select(selector)
    .append('div')
    .selectAll('button')
      .data([data1, data2])
    .join('button')
      // Embed index into datum for use with colour scale
      .datum((d, i) => [d, i])
      .text((_,i) => `Dataset ${i+1}`)
      .on('click', (_,[d,i]) => update(d, i));

  d3.select(selector)
    .append('p')
      .text('Use the buttons to update the graph with different data sets.')
}

export { task23 }
