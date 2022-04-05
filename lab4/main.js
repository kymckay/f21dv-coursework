import { nameData } from './modules/fetchers.js';
import { RankChart } from './modules/rank-chart.js';

(async () => {
  const [scotData, englWaleData] = await nameData();

  new RankChart('pop-ew', englWaleData).addCaption(
    'History of the 50 most popular baby names in England and Wales in the year 2020.'
  );
  new RankChart('pop-s', scotData).addCaption(
    'History of the 50 most popular baby names in Scotland in the year 2020.'
  );

  new RankChart('unpop-ew', englWaleData, 50, true).addCaption(
    'History of the 50 least popular baby names in England and Wales in the year 2020.'
  );
  new RankChart('unpop-s', scotData, 50, true).addCaption(
    'History of the 50 least popular baby names in Scotland in the year 2020.'
  );
})();
