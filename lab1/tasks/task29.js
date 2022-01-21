import { newPlot, linePlot } from './task22.js'
import { addPoints } from './task25.js'

function task29(selector) {
  const data = [
    {x:15,y:70},{x:40,y:65},{x:55,y:60},{x:80,y:100},{x:93,y:72}
  ];

  const plot_data = newPlot(data, selector);

  linePlot(data, plot_data, 'grey');
  const points = addPoints(data, plot_data, 'red', 'circle');

  // Overriding the color as requested
  const colors = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.y)))
    .range(['blue', 'green']);

  points.style('fill', d => colors(d.y));
}

export { task29 }
