import { covidData } from "./data.js";

let chart;
let xAxis;
let yAxis;
let line;
const margin = { top: 10, right: 30, bottom: 30, left: 70 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

export function addCasesChart(selector) {
  chart = d3.select(selector)
    .append('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  xAxis = chart.append('g')
      .attr('transform', `translate(0, ${height})`);

  yAxis = chart.append('g');

  line = chart.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5);

  updateCasesChart('GBR')
}

export async function updateCasesChart(iso_code) {
  const country = (await covidData())[iso_code];

  // Need to convert date strings to Date objects
  const timeParser = d3.timeParse('%Y-%m-%d');

  const x = d3.scaleTime()
    .domain(d3.extent(country.data, d => timeParser(d.date)))
    .range([0, width]);
  xAxis.transition()
    .duration(2000)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(country.data, d => d.total_cases)])
    .range([height, 0]);
  yAxis.transition()
    .duration(2000)
    .call(d3.axisLeft(y));

  line.datum(country.data)
    .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => x(timeParser(d.date)))
        .y(d => y(d.total_cases))
      );
}
