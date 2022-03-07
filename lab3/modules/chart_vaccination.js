import { vaccineData } from "./data.js";

let chart;
let xAxis;
let yAxis;
let total_line;
let booster_line;
const width = 690
const height = 600
const margin = { top: 10, right: 30, bottom: 30, left: 80 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

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

  updateVaccinesChart('GBR');
}

export async function updateVaccinesChart(iso_code) {
  const data = (await vaccineData())[iso_code];

  // Need to convert date strings to Date objects
  const timeParser = d3.timeParse('%Y-%m-%d');

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => timeParser(d.date)))
    .range([0, innerWidth]);
  xAxis.transition()
    .duration(2000)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_vaccinations)])
    .range([innerHeight, 0]);
  yAxis.transition()
    .duration(2000)
    .call(d3.axisLeft(y));

  total_line.datum(data)
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => x(timeParser(d.date)))
        .y(d => y(d.total_vaccinations))
      );

  // Not all entries have booster values since they started later
  booster_line.datum(data.filter(d => d.total_boosters))
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => x(timeParser(d.date)))
        .y(d => y(d.total_boosters))
      );
}
