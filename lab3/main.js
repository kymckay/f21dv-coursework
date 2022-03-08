import { makeColorScale } from './modules/color_scale.js';
import { covidData } from './modules/fetchers.js';
import makeLineChart from './modules/line_chart.js';
import { makeMap } from './modules/map.js';
import { makeCountryLabel } from './modules/country_label.js';

// Load covid data on page load so that it's ready
covidData();

makeMap();
makeColorScale('slippy_map');
makeCountryLabel('slippy_map', 'hoveredCountry');

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
