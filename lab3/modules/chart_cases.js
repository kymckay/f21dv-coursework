import { covidData } from "./fetchers.js";
import { addModelListener } from "./model.js";

let chart;
let xAxis;
let yAxis;
let line;
const width = 690
const height = 600
const margin = { top: 10, right: 30, bottom: 30, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

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

  addModelListener('selectedCountry', updateCasesChart);
}

async function updateCasesChart(iso_code) {
  const country = (await covidData())[iso_code];

  // Need to convert date strings to Date objects
  const timeParser = d3.timeParse('%Y-%m-%d');

  const x = d3.scaleTime()
    .domain(d3.extent(country.data, d => timeParser(d.date)))
    .range([0, innerWidth]);
  xAxis.transition()
    .duration(2000)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(country.data, d => d.total_cases)])
    .range([innerHeight, 0]);
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
