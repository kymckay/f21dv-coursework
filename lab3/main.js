import { ClusterChart } from './modules/cluster_chart.js';
import { covidData } from './modules/fetchers.js';
import { LineChart } from './modules/line_chart.js';
import { makeMap } from './modules/map.js';
import { addModelListener, updateModel } from './modules/model.js';

// Load covid data on page load so that it's ready ASAP
covidData();

makeMap();

// Toolbar section above line charts
addModelListener(async ({ selectedCountry }) => {
  if (!selectedCountry) return;

  const data = await covidData();
  d3.select('#charts-title')
      .text(`Showing data for ${data[selectedCountry].location}`);
});

// Selection box to change horizontal axis of all line charts
d3.select('#charts-select')
    .on('change', event => {
      updateModel({
        axisValue: event.target.value,
        bounds: null,
      });
    })
  .selectAll('option')
    .data(covidData.toPlotAgainst)
  .join('option')
    .attr('value', d => d)
    .text(d => d.split('_').join(' '));

// Button to clear country selection
d3.select('#reset-selection')
    .on('click', () => updateModel({selectedCountry: 'OWID_WRL'}));

// Button only usable when a country is selected
addModelListener((changes) => {
  if ('selectedCountry' in changes) {
    d3.select('#reset-selection').property('disabled', changes.selectedCountry === 'OWID_WRL');
  }
});

// Button to clear line chart zoom
d3.select('#reset-bounds')
    .on('click', () => updateModel({bounds: null}));

// Button only usable when charts are zoomed
addModelListener((changes) => {
  if ('bounds' in changes) {
    d3.select('#reset-bounds').property('disabled', !changes.bounds);
  }
});

new LineChart('line-charts', 'new_cases_smoothed');
new LineChart('line-charts', 'new_deaths_smoothed');
new LineChart('line-charts', 'people_vaccinated');
new LineChart('line-charts', 'people_fully_vaccinated');


// Use a clustered scatter chart to visualise relation between wealth and pandemic
new ClusterChart('scatter-plots', 'gdp_per_capita', 'total_cases_per_million').cluster(3);
new ClusterChart('scatter-plots', 'population_density', 'total_cases_per_million').cluster(3);
