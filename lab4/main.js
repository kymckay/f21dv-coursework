import { nameData } from './modules/fetchers.js';
import { LetterChart } from './modules/letter-chart.js';
import { RankChart } from './modules/rank-chart.js';
import { Top10Chart } from './modules/top10-chat.js';

(async () => {
  const [scotData, englWaleData] = await nameData();

  new RankChart('pop-s', scotData).addCaption(
    'History of the 50 most popular baby names in Scotland in the year 2020.'
  );
  new RankChart('pop-ew', englWaleData).addCaption(
    'History of the 50 most popular baby names in England and Wales in the year 2020.'
  );

  new RankChart('unpop-s', scotData, 50, true).addCaption(
    'History of the 50 least popular baby names in Scotland in the year 2020.'
  );
  new RankChart('unpop-ew', englWaleData, 50, true).addCaption(
    'History of the 50 least popular baby names in England and Wales in the year 2020.'
  );

  new Top10Chart('top-s', scotData);
  new Top10Chart('top-ew', englWaleData);

  new LetterChart('initial-s', scotData).addCaption(
    "The distribution of most to least common initials found in 2020's recorded Scottish baby names"
  );
  new LetterChart('initial-ew', englWaleData).addCaption(
    "The distribution of most to least common initials found in 2020's recorded English and Welsh baby names"
  );
})();
