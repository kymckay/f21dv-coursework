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

        this.addLine(
          name,
          d.map((d) => ({ x: d.year, y: d.rank })),
          d3.curveBumpX
        );
      });
    });

    this.addTitle('Popularity ranking (1 is most popular)');
  }
}
