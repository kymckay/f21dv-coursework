import { addCasesChart } from './modules/chart_cases.js';
import { addVaccinesChart } from './modules/chart_vaccination.js';
import { covidData } from './modules/fetchers.js';
import { makeMap } from './modules/map.js';

// Load covid data on page load so that it's ready
covidData();

makeMap();
addCasesChart('#v1');
addVaccinesChart('#v2')
