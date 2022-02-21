async function task16(selector) {
  const svg = d3.select(selector)
    .append('svg')
      .attr('width', 600)
      .attr('height', 500);
  const margin = 200;
  const width  = svg.attr('width') - margin;
  const height = svg.attr('height') - margin;

  svg.append('text')
      .attr('transform', 'translate(100,0)')
      .attr('x', 50)
      .attr('y', 50)
      .attr('font-size', '24px')
      .text('Stock Price');

  const x = d3.scaleBand()
      .range([0, width])
      .padding(0.4);

  const y = d3.scaleLinear()
      .range([height, 0]);

  const g = svg.append('g')
      .attr('transform', 'translate(' + 100 + ',' + 100 + ')');

  const data = await d3.csv('./15.csv');

  x.domain(data.map(d => d.year));
  y.domain([0, d3.max(data, d => d.value)]);

  g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
    .append('text')
      .attr('y', height - 250)
      .attr('x', width - 100)
      .attr('text-anchor', 'end')
      .attr('stroke', 'black')
      .text('Year');

  g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `$${d}`).ticks(10))
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-5.1em')
      .attr('text-anchor', 'end')
      .attr('stroke', 'black')
      .text('Stock Price');

  g.selectAll('.bar')
      .data(data)
    .join('rect')
      .attr('class', 'bar')
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
    .transition()
      .ease(d3.easeLinear)
      .duration(400)
      .delay((_, i) => i * 50)
      .attr('height', d => height - y(d.value));

  function onMouseOver(_, d) {
    d3.select(this)
        .classed('highlight', true)
      .transition()
        .duration(400)
        .attr('width', x.bandwidth() + 5)
        .attr('y', y(d.value) - 10)
        .attr('height', height - y(d.value) + 10);

    g.append('text')
        .classed('val', true)
        .attr('x', x(d.year))
        .attr('y', y(d.value) - 15)
        .text(`${d.value}`);
  }

  function onMouseOut(_, d) {
    // use the text label class to remove label on mouseout
    d3.select(this)
        .classed('highlight', false)
      .transition()
        .duration(400)
        .attr('width', x.bandwidth())
        .attr('y', y(d.value))
        .attr('height', height - y(d.value));

    d3.selectAll('.val')
      .remove();
  }

  d3.select(selector)
    .append('p')
      .text('The value of each bar will now be shown directly above on hover.');
}

export { task16 }
