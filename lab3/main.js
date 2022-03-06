import { addCasesChart } from './modules/chart_cases.js';
import { covidData } from './modules/data.js';
import { makeMap } from './modules/map.js';

// Load covid data on page load so that it's ready
covidData();

makeMap();
addCasesChart('#v1');
