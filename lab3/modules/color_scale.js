import { addModelListener } from "./model.js";

export function makeColorScale(element_id) {
  const colorSvg = d3.select(`#${element_id}`)
    .append('svg')
      .attr('viewBox', '0 0 320 50')
      .classed('colorbar', true);

  // Construct the gradient definition from the color scale
  const gradDef = colorSvg
    .append('defs')
    .append('linearGradient')
      .attr('id', 'scaleGradient');

  colorSvg.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 300)
      .attr('height', 20)
      .classed('colorbar-grad', true);

  const axis = colorSvg.append('g')
    .attr('transform', 'translate(10,30)');

  addModelListener('mapColors', (scale) => {
    if (!scale) return;

    const interp = (val) => {
      const [ min, max ] = scale.domain();
      return val * (max - min) + min;
    };

    const stops = [
      interp(0),
      interp(0.25),
      interp(0.5),
      interp(0.75),
      interp(1),
    ];

    gradDef.selectAll('stop')
      .data(stops)
    .join('stop')
      .attr('offset', (_,i) => `${i*25}%`)
      .attr('stop-color', d => scale(d));

    const axisScale = d3.scaleSequential()
      .domain(scale.domain())
      .range([0, 300]);
    axis.transition()
      .duration(2000)
      .call(d3.axisBottom(axisScale));
  })
}
