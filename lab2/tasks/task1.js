/**
 * Creates a line graph with circular data points that pulse on hover
 * @param {string} selector
 */
function task1(selector) {
  const data = [{x: 5, y: 10}, {x: 15, y: 27}, {x: 30, y: 50}, {x: 40, y: 60}, {x: 60, y: 70}];

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(selector)
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x) + 10])
    .range([ 0, width ]);
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y) + 10])
    .range([ height, 0 ]);
  svg.append('g')
    .call(d3.axisLeft(y));

  // Add the line
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
    )

  // Add points for the data, using custom event handlers to add and
  // remove a transition loop since applying a scale transformation
  // using CSS animation meant the coordinates also scale
  svg.selectAll('.datapoint')
    .data(data)
    .join('circle')
      .attr('fill', 'steelblue')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 10)
      .on('mouseenter', function() {
        // Event passed DOM element as `this`
        const hovered = d3.select(this);

        const grow = () => {
          hovered.transition()
            .duration(2000)
            .attr('r', 20)
            .on('end', shrink);
        }

        const shrink = () => {
          hovered.transition()
            .duration(2000)
            .attr('r', 10)
            .on('end', grow);
        }

        // Kick start transition cycle
        grow();
      })
      .on('mouseleave', function() {
        const hovered = d3.select(this);

        // Cancel the active transition
        hovered.interrupt();

        // Quickly revert to normal
        hovered.transition()
          .duration(500)
          .attr('r', 10);
      });

  d3.select(selector)
    .append('p')
    .text('Each data point pulses on hover using a loop of d3 transitions.');
}

export { task1 }
