function task27(selector) {
  const dataset = {
    apples: [5345, 2879, 1997, 2437, 4045],
    oranges: [2020, 1718, 347, 2828, 1223, 5000],
  };

  const width = 460,
     height = 300,
     radius = Math.min(width, height) / 2;

  const color = d3.scaleOrdinal().range(d3.schemeSet3);

  const pie = d3.pie()
     .sort(null);

  const arc = d3.arc()
     .innerRadius(radius - 100)
     .outerRadius(radius - 50);

  const svg = d3.select(selector)
    .append('svg')
     .attr('width', width)
     .attr('height', height)
     .append('g')
     .attr('transform', `translate(${width / 2},${height / 2})`);

  let parts = svg.selectAll('path')
      .data(pie(dataset.apples))
    .join('path')
      .attr('fill', (_,i) => color(i))
      .attr('d', arc)

  let state = 'apples';
  function update() {
    // switch data
    state = state === 'apples' ? 'oranges' : 'apples';

    // Want old data to power transition tween
    const oldData = parts.data();

    // First collapse existing segments
    parts = parts.data(pie(dataset[state]))
      .join(
        enter => enter.append('path')
          .attr('fill', (_,i) => color(i))
          .transition()
          .duration(1000)
          .attrTween('d', d => {
            const i = d3.interpolate(d.endAngle, d.startAngle);
            return function (t) {
                d.startAngle = i(t);
                return arc(d);
            }
          }),
        update => update.transition()
          .duration(1000)
          .attrTween('d', (d,i) => {
            const oldPart = oldData[i]
            const iStart = d3.interpolate(oldPart.startAngle, d.startAngle);
            const iEnd = d3.interpolate(oldPart.endAngle, d.endAngle)
            return function (t) {
                d.startAngle = iStart(t);
                d.endAngle = iEnd(t);
                return arc(d);
            }
          }),
        exit => exit.transition()
          .duration(1000)
          .attrTween('d', d => {
            const i = d3.interpolate(d.startAngle, d.endAngle);
            return function (t) {
                d.startAngle = i(t);
                return arc(d);
            }
          })
          .remove()
      )
  }

  d3.select(selector)
    .append('div')
    .append('button')
      .text('Switch data set')
      .on('click', update);

  d3.select(selector)
    .append('p')
      .text('Use the button to toggle the chart between data sets.')
}

export { task27 }
