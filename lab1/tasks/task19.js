import { barChart } from './task17.js'
import { taskData } from './task18.js'

const moduleData = d3.csv('./19.csv', d => Number(d.value));

async function task19(selector) {
  const data18 = await taskData();
  const data19 = await moduleData;

  // Add headings to clarify that data was from csv files
  barChart(selector, data18)
    .insert('h2', 'svg')
      .text('Data from 18.csv');
  barChart(selector, data19)
    .insert('h2', 'svg')
      .text('Data from 19.csv');
}

export { task19 }
