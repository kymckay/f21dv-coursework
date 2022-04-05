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
  constructor(id, data, initials = true) {
    const freqs = getLetterFrequencies(data, '2020', initials);

    // Sort the bins by value to make rank comparison easy for end user
    super(
      id,
      Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]),
      d3.extent(Object.values(freqs))
    );

    this.addBars(Object.entries(freqs).map(([x, y]) => ({ x, y })));
  }
}
