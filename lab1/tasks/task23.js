import { newPlot, linePlot } from './task22.js'

async function task23(selector) {
  const data = await d3.csv('./23.csv', row => {
    return { x: Number(row.x), y: Number(row.y) };
  });

  const plot_data = newPlot(data, selector);

  linePlot(data, plot_data, 'black');
}

export { task23 }
