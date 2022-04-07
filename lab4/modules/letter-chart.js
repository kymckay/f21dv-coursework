import { BarChart } from './bar-chart.js';

function getLetterFrequencies(data, year, initials = true) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const yearData = d3.group(data, (d) => d.year).get(new Date(year));

  return letters.reduce((pv, cv) => {
    const reducer = initials
      ? (pvd, cvd) => pvd + Number(cvd.name.charAt(0) === cv)
      : (pvd, cvd) => pvd + cvd.name.split('').filter((c) => c === cv).length;

    pv[cv] = yearData.reduce(reducer, 0);

    return pv;
  }, {});
}

export class LetterChart extends BarChart {
  constructor(id, data) {
    super(id);

    this.dataset = data;

    this.select = this.controls
      .append('select')
      .classed('letter-chart-select', true)
      .on('change', (event) => this.updateYear(event.target.value));

    this.select
      .selectAll('option')
      .data(d3.range(2020, 1996 - 1, -1))
      .join('option')
      .attr('value', (d) => d)
      .text((d) => d);

    this.updateYear('2020');
  }

  updateYear(year) {
    const freqs = getLetterFrequencies(this.dataset, year);

    // Sort the bins by value to make rank comparison easy for end user
    this.updateAxes(
      Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]),
      d3.extent(Object.values(freqs))
    );

    this.updateBars(Object.entries(freqs).map(([x, y]) => ({ x, y })));
  }
}
