import { LineChart } from './line-chart.js';

function mostPopularNames(data, year, limit = 100) {
  const yearData = d3.group(data, (d) => d.year).get(new Date(year));

  yearData.sort((a, b) => b.count - a.count);

  const top = yearData.slice(0, limit);

  // Each name + sex combo is a different name instance, this structure allows lookup
  return top.reduce((pv, cv, i) => {
    if (!pv[cv.name]) {
      pv[cv.name] = {};
    }

    // Current index is the sorted overall popularity
    pv[cv.name][cv.sex] = i + 1;

    return pv;
  }, {});
}

export class RankChart extends LineChart {
  constructor(data) {
    const topNames = mostPopularNames(data, '2020', 100);
    const lines = [];

    const xRange = d3.extent(data, (d) => d.year);
    const yRange = d3.extent(data, (d) => d.rank);

    super(xRange, yRange, true, true);

    d3.group(
      data,
      (d) => d.name,
      (d) => d.sex
    ).forEach((d, name) => {
      if (!topNames[name]) return;

      d.forEach((d, sex) => {
        if (!topNames[name][sex]) return;

        const label = `${name} (${sex})`;
        const id = `line-${name}${sex}`;
        lines.push({ id, label });

        this.addLine(
          d.map((d) => ({ x: d.year, y: d.rank })),
          d3.curveBumpX
        )
          .classed(id, true)
          .on('mouseenter', (e) =>
            d3.select(e.currentTarget).classed('rank-line-hover', true)
          )
          .on('mouseleave', (e) =>
            d3.select(e.currentTarget).classed('rank-line-hover', false)
          )
          .on('click', () => this.updateSelection(id));
      });
    });

    this.addTitle('Popularity ranking (1 is most popular)');

    this.select = this.controls
      .append('select')
      .classed('rank-chart-select', true)
      .on('change', (event) => this.updateSelection(event.target.value));

    this.select
      .selectAll('option')
      .data(
        [{ id: 'none', label: '<None>' }].concat(
          lines.sort((a, b) => a.label.localeCompare(b.label))
        )
      )
      .join('option')
      .attr('value', (d) => d.id)
      .text((d) => d.label);
  }

  updateSelection(selection) {
    const unselecting = this.selected === selection || selection === 'none';

    this.chart
      .select('.rank-line-selected')
      .classed('rank-line-selected', false);

    this.selected = unselecting ? null : selection;

    this.select.property('value', unselecting ? 'none' : selection);

    if (unselecting) return;

    this.chart.select(`.${selection}`).classed('rank-line-selected', true);
  }
}
