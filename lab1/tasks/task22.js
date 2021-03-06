// This is just to make preparing the figure independently reusable so
// I can plot more than one line on the same figure
function newPlot(data, selector, xSize = 600, ySize = 600, margin = 40) {
  const xMax = xSize - margin*2;
  const yMax = ySize - margin*2;

  // Get the 'limits' of the data - the full extent (mins and max)
  // so the plotted data fits perfectly
  const xExtent = d3.extent( data, d => d.x );
  const yExtent = d3.extent( data, d => d.y );

  // Use group to contain axes
  const group = d3.select(selector)
    .append('svg')
      .attr('width', xSize)
      .attr('height', ySize)
    .append('g')
      .attr('transform', `translate(${margin},${margin})`);

  // X Axis
  const x = d3.scaleLinear()
    .domain([ xExtent[0], xExtent[1] ])
    .range([0, xMax]);

  // bottom
  group.append('g')
    .attr('transform', `translate(0,${yMax})`)
    .call(d3.axisBottom(x));

  // top
  group.append('g')
    .call(d3.axisTop(x));

  // Y Axis
  const y = d3.scaleLinear()
    .domain([ yExtent[0], yExtent[1] ])
    .range([ yMax, 0]);

  // left y axis
  group.append('g')
    .call(d3.axisLeft(y));

  // right y axis
  group.append('g')
    .attr('transform', `translate(${yMax},0)`)
    .call(d3.axisRight(y));

  return {
      group,
      x,
      y
  };
}

// For task 22-24
function linePlot(data, plot_data, color) {
  // Add the line
  plot_data.group
    .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d',
        d3.line()
          .x(d => plot_data.x(d.x))
          .y(d => plot_data.y(d.y))
      );
};

function task22(selector) {
  d3.select(selector)
    .append('p')
    .html(`This task was just to make a function for line plots.
    I introduced <code>newPlot</code> for preparing the canvas and
    <code>linePlot</code> for adding lines plots to it.`);
}

export { task22, newPlot, linePlot }
