import { ClusterChart } from './modules/cluster_chart.js';
import { covidData } from './modules/fetchers.js';
import makeLineChart from './modules/line_chart.js';
import { makeMap } from './modules/map.js';
import { addModelListener, axisTypes, updateModel } from './modules/model.js';

// Load covid data on page load so that it's ready
covidData();

makeMap();

makeLineChart(
  'cases',
  'total_cases',
  'red',
);
makeLineChart(
  'vaccinated',
  'people_vaccinated',
  'blue'
);
makeLineChart(
  'boosted',
  'people_fully_vaccinated',
  'cyan'
);

addModelListener('selectedCountry', async (model) => {
  const { selectedCountry } = model;
  if (!selectedCountry) return;

  const data = await covidData();
  d3.select('#charts-title')
      .text(`Showing data for ${data[selectedCountry].location}`);
});

d3.select('#charts-select')
    .on('change', event => {
      updateModel('axisValue', event.target.value);
    })
  .selectAll('option')
    .data(axisTypes)
  .join('option')
    .attr('value', d => d)
    .text(d => d.split('_').join(' '));

// Use a clustered scatter chart to visualise relation between wealth and pandemic
new ClusterChart('cluster_gdp', 'gdp_per_capita', 'total_cases_per_million').cluster(3);
new ClusterChart('cluster_pop', 'population_density', 'total_cases_per_million').cluster(3);
