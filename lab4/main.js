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

  return yearData.slice(0, limit).map((d) => d.name);
}

function rankChart(data) {
  const names = mostPopularNames(data, '2020', 30);

  const xRange = d3.extent(data, (d) => d.year);
  const yRange = d3.extent(data, (d) => d.rank);

  const rankChart = new LineChart(xRange, yRange, true, true);
  for (const name of d3.groups(data, (d) => d.name)) {
    if (!names.includes(name[0])) continue;

    rankChart.addLine(
      name[0],
      name[1].map((d) => {
        return { x: d.year, y: d.rank };
      }),
      d3.curveBumpX
    );
  }
}
