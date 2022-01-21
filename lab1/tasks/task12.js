const moduleData = d3.csv('./12.csv');

async function taskData() {
  const data = await moduleData;

  // Each shape has a different tag so must be joined separately
  const lines = data.filter(obj => obj.shape === 'line');
  const rects = data.filter(obj => obj.shape === 'rect');
  const circles = data.filter(obj => obj.shape === 'circle');
  const ellipses = data.filter(obj => obj.shape === 'ellipse');

  return {
    lines,
    rects,
    circles,
    ellipses,
  };
}

async function task12(selector) {
  const data = await taskData();

  const svg = d3.select(selector)
    .append('svg')
      .attr('width', 400)
      .attr('height', 400)
      .style('border', '1px solid green');

  // Attributes order is fixed in CSV since mixing multiple shapes
  function addSvgElements(tag, shapeData, a1, a2, a3, a4) {
    svg.selectAll(tag)
        // Data uniquely identified by composite key of attributes
        .data(shapeData, d => `${d.shape}${d.v1}${d.v2}${d.v3}${d.v4}`)
      .join(tag)
        .attr(a1, d => d.v1)
        .attr(a2, d => d.v2)
        .attr(a3, d => d.v3)
        .attr(a4, d => d.v4)
        .attr('fill', d => d.fill)
        .attr('stroke', d => d.stroke)
        .attr('stroke-width', 5);
  }

  addSvgElements('ellipse', data.ellipses, 'cx', 'cy', 'rx', 'ry');
  addSvgElements('rect', data.rects, 'x', 'y', 'width', 'height');
  addSvgElements('line', data.lines, 'x1', 'x2', 'y1', 'y2');
  // Circles only have 3 attributes so using fake 4th
  addSvgElements('circle', data.circles, 'cx', 'cy', 'r', 'data-fake');

  return svg;
}

export { taskData, task12 }
