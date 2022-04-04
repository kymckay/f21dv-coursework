import { nameData } from './modules/fetchers.js';
import { RankChart } from './modules/rank-chart.js';

(async () => {
  const [scotData, englWaleData] = await nameData();

  new RankChart(englWaleData).addCaption(
    'The chart shows top 100 baby names in England and Wales in the year 2020.'
  );
  new RankChart(scotData).addCaption(
    'The chart shows the top 100 baby names in Scotland in the year 2020.'
  );
})();
