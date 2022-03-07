import { covidData } from "./fetchers.js";
import { addModelListener } from "./model.js";

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

// Need to convert date strings to Date objects
const timeParser = d3.timeParse('%Y-%m-%d');

export function addCasesChart(selector) {
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

  addModelListener('selectedCountry', updateCasesChart);
  addModelListener('brushedTime', highlightPoint);
  addModelListener('brushing', togglePoint);
}

async function updateCasesChart(iso_code) {
  const country = (await covidData())[iso_code];

  xScale.domain(d3.extent(country.data, d => timeParser(d.date)));
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
        .x(d => xScale(timeParser(d.date)))
        .y(d => yScale(d.total_cases))
      );
}

function highlightPoint(time_value) {
  if (!time_value) return;

  // Find closest data point to left of brushed time
  const bisect = d3.bisector(d => timeParser(d.date)).left

  const data = line.datum();
  const index = bisect(data, time_value, 1);
  const datapoint = data[index];

  // Convert back to range coordinate space to position elements
  const x_scaled = xScale(timeParser(datapoint.date));
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
