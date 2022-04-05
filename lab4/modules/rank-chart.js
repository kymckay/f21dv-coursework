import { LineChart } from './line-chart.js';

/**
 * Convenient function for consistent identifiers for every name + sex combination
 * @param {object} name name object with name and sex
 * @returns a unique ID string (suitable for display)
 */
function getNameId(name) {
  return `${name.name} (${name.sex})`;
}

/**
 * Get the most/least popular names in a given year
 * @param {object[]} data name data array
 * @param {string} year the year of interest
 * @param {number} limit how many names to retrieve
 * @returns object of keys in form `name-sex` for lookup, values are popularity rank (1-indexed)
 */
export function getRankedNames(data, year, limit = 100, invert = false) {
  const yearData = d3.group(data, (d) => d.year).get(new Date(year));

  yearData.sort((a, b) => b.count - a.count);

  if (invert) {
    yearData.reverse();
  }

  const top = yearData.slice(0, limit);

  // Each name + sex combo is a different name instance, this structure allows lookup
  return top.reduce((pv, cv, i) => {
    // Current index is the sorted overall popularity
    pv[getNameId(cv)] = i + 1;

    return pv;
  }, {});
}

export class RankChart extends LineChart {
  constructor(id, data, limit = 50, inverted = false) {
    const topNames = getRankedNames(data, '2020', limit, inverted);
    const relevantData = data.filter((d) => !!topNames[getNameId(d)]);

    const xRange = d3.extent(relevantData, (d) => d.year);
    const yRange = d3.extent(relevantData, (d) => d.rank);

    super(id, xRange, yRange, true, true);

    const lines = [];
    d3.group(relevantData, (d) => getNameId(d)).forEach((d, id) => {
      const rank = topNames[id];
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
