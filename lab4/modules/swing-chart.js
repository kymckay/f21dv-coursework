import { LineChart } from './line-chart.js';
import { getNameId } from './rank-chart.js';

function getSwungNames(data, limit = 100) {
  const swingData = [];
  d3.group(data, (d) => getNameId(d)).forEach((nameData, id) => {
    swingData.push({
      id,
      swing: d3.max(nameData, (d) => d.rank) - d3.min(nameData, (d) => d.rank),
    });
  });

  // Largest swing at front of array
  swingData.sort((a, b) => b.swing - a.swing);

  const top = swingData.slice(0, limit);

  // Each name + sex combo is a different name instance, this structure allows lookup
  return top.reduce((pv, cv, i) => {
    // Current index is the sorted overall swing
    pv[cv.id] = i + 1;

    return pv;
  }, {});
}

export class SwingChart extends LineChart {
  constructor(id, data, limit = 50) {
    const swungNames = getSwungNames(data, limit);
    const relevantData = data.filter((d) => !!swungNames[getNameId(d)]);

    const xRange = d3.extent(relevantData, (d) => d.year);
    const yRange = d3.extent(relevantData, (d) => d.rank);

    super(id, xRange, yRange, true, true);

    const lines = [];
    d3.group(relevantData, (d) => getNameId(d)).forEach((d, id) => {
      const rank = swungNames[id];
      lines.push({ label: id, rank });

      this.addLine(
        d.map((d) => ({ x: d.year, y: d.rank })),
        d3.curveBumpX
      )
        .classed(`line-${rank}`, true)
        .on('mouseenter', (e) =>
          d3.select(e.currentTarget).classed('rank-line-hover', true)
        )
        .on('mouseleave', (e) =>
          d3.select(e.currentTarget).classed('rank-line-hover', false)
        )
        .on('click', () => this.updateSelection(rank));
    });

    this.addTitle('Popularity ranking (1 is most popular)');

    this.select = this.controls
      .append('select')
      .classed('rank-chart-select', true)
      .on('change', (event) => this.updateSelection(event.target.value));

    this.select
      .selectAll('option')
      .data(
        [{ label: 'No selection', rank: '-1' }].concat(
          lines.sort((a, b) => a.label.localeCompare(b.label))
        )
      )
      .join('option')
      .attr('value', (d) => d.rank)
      .text((d) => d.label);
  }

  updateSelection(selection) {
    const unselecting = this.selected === selection || selection === '-1';

    this.chart
      .select('.rank-line-selected')
      .classed('rank-line-selected', false);

    this.selected = unselecting ? null : selection;

    this.select.property('value', unselecting ? '-1' : selection);

    if (!unselecting) {
      this.chart
        .select(`.line-${selection}`)
        .classed('rank-line-selected', true);
    }
  }
}
