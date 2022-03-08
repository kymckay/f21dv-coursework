import { covidData } from "./fetchers.js";
import { addModelListener, updateModel } from "./model.js";

let title;
let chart;
let xAxis;
let yAxis;
let line;
let focus_circle;
let focus_text;
const width = 690
const height = 600
const margin = { top: 10, right: 30, bottom: 30, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Scales are reused across event listeners and functions
const xScale = d3.scaleTime()
  .range([0, innerWidth]);
const yScale = d3.scaleLinear()
  .range([innerHeight, 0]);

export function addCasesChart(selector) {
  title = d3.select(selector).append('h2').text('Loading...');

  chart = d3.select(selector)
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
      .attr('stroke', 'red')
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
    .on('mouseenter', () => updateModel('brushing', true))
    .on('mousemove', onMouseMove)
    .on('mouseout', () => updateModel('brushing', false));

  addModelListener('selectedCountry', updateCasesChart);
  addModelListener('brushedTime', highlightPoint);
  addModelListener('brushing', togglePoint);


  function onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = xScale.invert(x_mouse);

    updateModel('brushedTime', x_value);
  }
}

async function updateCasesChart(iso_code) {
  const country = (await covidData())[iso_code];

  title.text(`Cases of COVID-19 in ${country.location}`)

  xScale.domain(d3.extent(country.data, d => d.date));
  xAxis.transition()
    .duration(2000)
    .call(d3.axisBottom(xScale));

  yScale.domain([0, d3.max(country.data, d => d.total_cases)])
  yAxis.transition()
    .duration(2000)
    .call(d3.axisLeft(yScale));

  // Data is imperfect and breaks line if value is missing, so filter
  line.datum(country.data.filter(d => d.total_cases))
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.total_cases))
      );
}

function highlightPoint(time_value) {
  if (!time_value) return;

  // Find closest data point to left of brushed time
  const bisect = d3.bisector(d => d.date).left

  const data = line.datum();
  const index = bisect(data, time_value, 1);
  const datapoint = data[index];

  // Convert back to range coordinate space to position elements
  const x_scaled = xScale(datapoint.date);
  const y_scaled = yScale(datapoint.total_cases);

  focus_circle
      .attr('cx', x_scaled)
      .attr('cy', y_scaled);
  focus_text
      .attr('x', x_scaled)
      .attr('y', y_scaled - 15)
      .text(datapoint.total_cases.toLocaleString());
}

function togglePoint(brushing) {
  focus_text.attr('opacity', brushing ? 0.8 : 0);
  focus_circle.attr('opacity', brushing ? 0.8 : 0);
}
