function task20(selector) {
  const data1 = [
    {group: 'A', value: 5},
    {group: 'B', value: 20},
    {group: 'C', value: 9}
  ];

  const data2 = [
    {group: 'A', value: 10},
    {group: 'B', value: 2},
    {group: 'C', value: 22}
  ];

  const data3 = [
    {group: 'A', value: 16},
    {group: 'B', value: 4},
    {group: 'C', value: 13}
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

  // X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data1.map(d => d.group))
    .padding(0.2);
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 22])
    .range([ height, 0]);
  svg.append('g')
      .attr('class', 'myYaxis')
      .call(d3.axisLeft(y));

  // The domain is up to the number of data sets since the scale
  // wraps back around to the same colour
  const colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0,3]);

  function onMouseOver(_,d) {
    svg.append('text')
        .classed('tip', true)
        .attr('x', x(d.group) + x.bandwidth()/2)
        .attr('y', y(d.value) + - 10)
        .attr('text-anchor', 'middle')
        .text(d.value);
  }

  function onMouseOut() {
    svg.selectAll('.tip').remove();
  }

  // A function that create / update the plot for a given variable:
  function update(data, index) {
    svg.selectAll('rect')
        // Use group as key in case data is unordered
        .data(data, d => d.group)
      .join('rect')
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
      .transition()
        .duration(1000)
        .attr('x', d => x(d.group))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', colorScale(index));
  }
  update(data1, 0);

  d3.select(selector)
    .append('div')
    .selectAll('button')
      .data([data1, data2, data3])
    .join('button')
      // Embed index into datum for use with colour scale
      .datum((d, i) => [d, i])
      .text((_,i) => `Dataset ${i+1}`)
      .on('click', (_,[d, i]) => update(d, i));

  d3.select(selector)
    .append('p')
      .text('Use the buttons to update the graph with different data sets. The value of each bar is shown on hover.')
}

export { task20 }
