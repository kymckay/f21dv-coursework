import { covidData } from "./fetchers.js";
import { addModelListener, updateModel } from "./model.js";

export default function makeLineChart(
  element_id,
  covidStat,
  color = 'blue',
) {
  const width = 500
  const height = 250
  const margin = { top: 10, right: 30, bottom: 30, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales are reused across event listeners
  let xScale;
  addModelListener('axisValue', model => {
    const { axisValue } = model;

    // Only date dimension is non-numeric
    xScale = axisValue === 'date' ? d3.scaleTime() : d3.scaleLinear();
    xScale.range([0, innerWidth]);
  })

  const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

  // Elements are reused across event listeners
  let chart;
  let xAxis;
  let yAxis;
  let line;
  let focus_circle;
  let focus_text;

  chart = d3.select(`#${element_id}`)
    .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  xAxis = chart.append('g')
      .attr('transform', `translate(0, ${innerHeight})`);

  yAxis = chart.append('g');

  line = chart.append('path')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5);

  // Circle will show on mouseover, hidden initially
  focus_circle = chart.append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('r', 8.5)
      .attr('opacity', 0);

  // Text of value appears on hover, above the line
  focus_text = chart.append('text')
      .attr('opacity', 0)
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle');

  chart.append('rect')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .on('mousemove', onMouseMove)
    .on('mouseout', () => updateModel('brushedValue', null));

  addModelListener('selectedCountry', updateCasesChart);
  addModelListener('axisValue', updateCasesChart);
  addModelListener('brushedValue', highlightPoint);

  function onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = xScale.invert(x_mouse);

    updateModel('brushedValue', x_value);
  }

  async function updateCasesChart(model) {
    const { axisValue, selectedCountry } = model;
    const country = (await covidData())[selectedCountry];

    // Prevent large numeric values from creating long tick labels
    const x = d3.axisBottom(xScale)
    if (axisValue !== 'date') {
      x.ticks(null, 's');
    }

    // Use full extent of x-axis for consistency across line charts
    xScale.domain(d3.extent(country.data, d => d[axisValue]));
    xAxis.transition()
      .duration(2000)
      .call(x);

    // Quantity of interest should always be shown with respect to 0
    yScale.domain([0, d3.max(country.data, d => d[covidStat])])
    yAxis.transition()
      .duration(2000)
      .call(d3.axisLeft(yScale));

    // Not all records will have both data dimensions present
    // Compare to null to keep values of 0
    line.datum(country.data.filter(d =>
      d[covidStat] != null
      && d[axisValue] != null
    ))
      .transition()
        .duration(2000)
        .attr('d', d3.line()
          .x(d => xScale(d[axisValue]))
          .y(d => yScale(d[covidStat]))
        );
  }

  function highlightPoint(model) {
    const { axisValue, brushedValue } = model;

    // Value set to null when mouse leaves chart
    if (!brushedValue) {
      focus_text.attr('opacity', 0);
      focus_circle.attr('opacity', 0);
      return;
    }

    const data = line.datum();

    // Only highlight if datapoint exists aligned with cursor
    if (
      brushedValue < data[0][axisValue]
      || brushedValue > data[data.length-1][axisValue]
    ) {
      focus_text.attr('opacity', 0);
      focus_circle.attr('opacity', 0);
      return;
    }

    // Find closest data point to left of brushed time
    const bisect = d3.bisector(d => d[axisValue]).left
    const index = bisect(data, brushedValue);
    const datapoint = data[index];

    if (!datapoint) return;

    // Convert back to range coordinate space to position elements
    const x_scaled = xScale(datapoint[axisValue]);
    const y_scaled = yScale(datapoint[covidStat]);

    focus_circle
        .attr('cx', x_scaled)
        .attr('cy', y_scaled);
    focus_text
        .attr('x', x_scaled)
        .attr('y', y_scaled - 15)
        .text(datapoint[covidStat].toLocaleString());

    focus_text.attr('opacity', 0.8);
    focus_circle.attr('opacity', 0.8);
  }
}
