import { covidData } from "./fetchers.js";
import { addModelListener, pandemicStart, updateModel } from "./model.js";

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
  const xScale = d3.scaleTime()
    .range([0, innerWidth]);
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
    .on('mouseout', () => updateModel('brushedTime', null));

  addModelListener('selectedCountry', updateCasesChart);
  addModelListener('brushedTime', highlightPoint);

  function onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = xScale.invert(x_mouse);

    updateModel('brushedTime', x_value);
  }

  async function updateCasesChart(iso_code) {
    const country = (await covidData())[iso_code];

    xScale.domain([pandemicStart, d3.max(country.data, d => d.date)]);
    xAxis.transition()
      .duration(2000)
      .call(d3.axisBottom(xScale));

    yScale.domain([0, d3.max(country.data, d => d[covidStat])])
    yAxis.transition()
      .duration(2000)
      .call(d3.axisLeft(yScale));

    // Data is imperfect and breaks line if value is missing, so filter
    line.datum(country.data.filter(d => d[covidStat]))
      .transition()
        .duration(2000)
        .attr('d', d3.line()
          .x(d => xScale(d.date))
          .y(d => yScale(d[covidStat]))
        );
  }

  function highlightPoint(time_value) {
    // Value set to null when mouse leaves chart
    if (!time_value) {
      focus_text.attr('opacity', 0);
      focus_circle.attr('opacity', 0);
      return;
    }

    const data = line.datum();

    // Only highlight if datapoint exists aligned with cursor
    if (
      time_value < data[0].date
      || time_value > data[data.length-1].date
    ) {
      focus_text.attr('opacity', 0);
      focus_circle.attr('opacity', 0);
      return;
    }

    // Find closest data point to left of brushed time
    const bisect = d3.bisector(d => d.date).left
    const index = bisect(data, time_value);
    const datapoint = data[index];

    if (!datapoint) return;

    // Convert back to range coordinate space to position elements
    const x_scaled = xScale(datapoint.date);
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