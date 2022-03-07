import { vaccineData } from "./data.js";

let chart;
let xAxis;
let yAxis;
let total_line;
let booster_line;
let focus_circle;
let focus_text;
const width = 690
const height = 600
const margin = { top: 10, right: 30, bottom: 30, left: 80 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Scales are reused across event listeners and functions
const xScale = d3.scaleTime()
  .range([0, innerWidth]);
const yScale = d3.scaleLinear()
  .range([innerHeight, 0]);

// Need to convert date strings to Date objects
const timeParser = d3.timeParse('%Y-%m-%d');

export function addVaccinesChart(selector) {
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

  total_line = chart.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5);

  booster_line = chart.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'blue')
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
    .on('mouseenter', () => {
      focus_text.attr('opacity', 0.8);
      focus_circle.attr('opacity', 0.8);
    })
    .on('mousemove', onMouseMove)
    .on('mouseout', () => {
      focus_text.attr('opacity', 0);
      focus_circle.attr('opacity', 0);
    })

  updateVaccinesChart('GBR');

  // When mouse moves, reverse lookup x value and find closest data point
  const bisect = d3.bisector(d => timeParser(d.date)).left
  function onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = xScale.invert(x_mouse);

    // Find closest data point to left of mouse position
    const data = total_line.datum();
    const index = bisect(data, x_value, 1);
    const datapoint = data[index];

    // Convert back to range coordinate space to position elements
    const x_scaled = xScale(timeParser(datapoint.date));
    const y_scaled = yScale(datapoint.total_vaccinations);

    focus_circle
        .attr('cx', x_scaled)
        .attr('cy', y_scaled);
    focus_text
        .attr('x', x_scaled)
        .attr('y', y_scaled - 15)
        .text(datapoint.total_vaccinations.toLocaleString());
  }
}

export async function updateVaccinesChart(iso_code) {
  const data = (await vaccineData())[iso_code];

  xScale.domain(d3.extent(data, d => timeParser(d.date)));
  xAxis.transition()
    .duration(2000)
    .call(d3.axisBottom(xScale));

  yScale.domain([0, d3.max(data, d => d.total_vaccinations)]);
  yAxis.transition()
    .duration(2000)
    .call(d3.axisLeft(yScale));

  total_line.datum(data)
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => xScale(timeParser(d.date)))
        .y(d => yScale(d.total_vaccinations))
      );

  // Not all entries have booster values since they started later
  booster_line.datum(data.filter(d => d.total_boosters))
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => xScale(timeParser(d.date)))
        .y(d => yScale(d.total_boosters))
      );
}
