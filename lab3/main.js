import { ClusterChart } from './modules/cluster_chart.js';
import { covidData } from './modules/fetchers.js';
import { LineChart } from './modules/line_chart.js';
import { makeMap } from './modules/map.js';
import { addModelListener, axisTypes, updateModel } from './modules/model.js';

// Load covid data on page load so that it's ready
covidData();

makeMap();

new LineChart('lines', 'new_cases');
new LineChart('lines', 'people_vaccinated');
new LineChart('lines', 'people_fully_vaccinated');

addModelListener(async ({ selectedCountry }) => {
  if (!selectedCountry) return;

  const data = await covidData();
  d3.select('#charts-title')
      .text(`Showing data for ${data[selectedCountry].location}`);
});

d3.select('#charts-select')
    .on('change', event => {
      updateModel({axisValue: event.target.value});
    })
  .selectAll('option')
    .data(['date'].concat(axisTypes))
  .join('option')
    .attr('value', d => d)
    .text(d => d.split('_').join(' '));

// Use a clustered scatter chart to visualise relation between wealth and pandemic
new ClusterChart('cluster_gdp', 'gdp_per_capita', 'total_cases_per_million').cluster(3);
new ClusterChart('cluster_pop', 'population_density', 'total_cases_per_million').cluster(3);
