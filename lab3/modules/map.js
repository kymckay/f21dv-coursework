import { covidData } from './data.js';

// const svg = d3.select('#map');

// const projection = d3.geoMercator();

// const pathGenerator = d3.geoPath()
//   .projection(projection);

export async function makeMap() {
  console.log(await covidData())
}
