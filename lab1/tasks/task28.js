import { task17 } from './task17.js'

function task28(selector) {
  const rects = task17(selector);
  const data = rects.data();

  const colors = d3.scaleLinear()
    .domain([0, d3.mean(data), d3.max(data)])
    .range(['green','yellow','orange']);

  rects.attr('fill', d => colors(d));
}

export { task28 }
