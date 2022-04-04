import { nameData } from './modules/fetchers.js';
import { LineChart } from './modules/line-chart.js';

(async () => {
  const [scotData, englWaleData] = await nameData();

  rankChart(scotData);
  rankChart(englWaleData);
})();

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

function rankChart(data) {
  const topNames = mostPopularNames(data, '2020', 100);

  const xRange = d3.extent(data, (d) => d.year);
  const yRange = d3.extent(data, (d) => d.rank);

  const rankChart = new LineChart(xRange, yRange, true, true);
  d3.group(
    data,
    (d) => d.name,
    (d) => d.sex
  ).forEach((d, name) => {
    if (!topNames[name]) return;

    d.forEach((d, sex) => {
      if (!topNames[name][sex]) return;

      rankChart.addLine(
        name,
        d.map((d) => ({ x: d.year, y: d.rank })),
        d3.curveBumpX
      );
    });
  });
}
