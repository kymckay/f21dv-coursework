import { task26 } from './task26.js'

function task27(selector) {
  const plot_data = task26(selector);

    // Pick points of interest out of bound data
    const points = [
      plot_data.points25.data()[2],
      plot_data.points26.data()[1],
    ];

    plot_data.group
      .append('g')
      .selectAll('text')
        .data(points)
    .join('text')
      .text(d => `${d.x},${d.y}`)
      .attr('transform', d => {
        return `translate(${plot_data.x(d.x) + 7},${plot_data.y(d.y)})`;
      });
}

export { task27 }
