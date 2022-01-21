import { task30 } from './task30.js'

function task31(selector) {
  const {arcs, arcGenerator} = task30(selector);

  // Add text to slice centroids for task 31
  arcs.append('text')
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .text(d => d.data)
      .style('text-anchor', 'middle');
}

export { task31 }
