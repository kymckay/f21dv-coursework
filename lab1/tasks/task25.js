import { newPlot, linePlot } from './task22.js'

function addPoints(data, plot_data, color, shape) {
  const points = plot_data.group
    .append('g')
    .selectAll(shape)
      .data(data)
    .join(shape);

    switch (shape) {
        case 'circle':
            points.attr('cx', d => plot_data.x(d.x))
                .attr('cy', d => plot_data.y(d.y))
                .attr('r', 5);
            break;
        case 'polygon':
            // These aren't equalateral, but close enough
            points.attr('points', d => {
                const cx = plot_data.x(d.x);
                const cy = plot_data.y(d.y);
                return `${cx+5},${cy+5} ${cx-5},${cy+5} ${cx},${cy-5}`;
            });
            break;
        default:
            break;
    }

    points.style('fill', color);

    return points;
}

function task25(selector) {
  const data = [
    {x:1,y:2},{x:3,y:5},{x:4,y:5},{x:7,y:10},{x:9,y:7}
  ];

  const plot_data = newPlot(data, selector);

  linePlot(data, plot_data, 'red');
  const points25 = addPoints(data, plot_data, 'red', 'circle');

  return { ...plot_data, points25 };
}

export { task25, addPoints }
