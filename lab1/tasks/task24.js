import { newPlot, linePlot } from './task22.js'

function task24(selector) {
  const numPoints = 100;
  const dataSin = [];
  const dataCos = [];
  for (let i = 0; i < numPoints; i++) {
    dataSin.push({
      x: i/100,
      y: Math.sin(6.2 * i/100)
    });

    dataCos.push({
      x: i/100,
      y: Math.cos(6.2 * i/100)
    });
  }

  const plot_data = newPlot(dataSin, selector);

  linePlot(dataSin, plot_data, 'blue');
  linePlot(dataCos, plot_data, 'green');
}

export { task24 }
