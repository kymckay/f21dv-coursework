import { barChart } from './task17.js'

const moduleData = d3.csv('./18.csv', d => Number(d.value));

async function taskData() {
  return await moduleData;
}

async function task18(selector) {
  // Expected csv structure is single column with title 'value'
  const data = await taskData();
  const div = barChart(selector, data);

  // Add heading to clarify that data was from csv file
  div.insert('h2', 'svg').text('Data from 18.csv');
}

export { taskData, task18 }
