import { linePlot, newPlot } from "./task22.js";

function task32(selector) {
  const data = [
    {x:15,y:70},{x:40,y:65},{x:55,y:60},{x:80,y:100},{x:93,y:72}
  ];
  const png = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/768px-Yin_yang.svg.png';

  const plot_data = newPlot(data, selector);

  // Add image first as background
  plot_data.group.append('svg:image')
      .attr('xlink:href', png)
      .attr('width', 520)
      .attr('height', 520);

  linePlot(data, plot_data, 'red');
}

export { task32 }
