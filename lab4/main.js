import { nameData } from './modules/fetchers.js';
import { LetterChart } from './modules/letter-chart.js';
import { RankChart } from './modules/rank-chart.js';
import { SwingChart } from './modules/swing-chart.js';
import { Top10Chart } from './modules/top10-chat.js';

(async () => {
  const [scotData, englWaleData] = await nameData();

  new Top10Chart('top-s', scotData).addCaption(
    'Rank shifts in the 10 most popular baby names in Scotland.'
  );
  new Top10Chart('top-ew', englWaleData).addCaption(
    'Rank shifts in the 10 most popular baby names in England and Wales.'
  );

  new RankChart('pop-s', scotData).addCaption(
    'History of the 50 most popular baby names in Scotland in the year 2020.'
  );
  new RankChart('pop-ew', englWaleData).addCaption(
    'History of the 50 most popular baby names in England and Wales in the year 2020.'
  );

  new SwingChart('swing-s', scotData, 50).addCaption(
    'History of the 50 baby names with the largest swings in popularity in Scotland.'
  );
  new SwingChart('swing-ew', englWaleData, 50).addCaption(
    'History of the 50 baby names with the largest swings in popularity in England and Wales.'
  );

  new LetterChart('initial-s', scotData).addCaption(
    "The distribution of most to least common initials found in 2020's recorded Scottish baby names"
  );
  new LetterChart('initial-ew', englWaleData).addCaption(
    "The distribution of most to least common initials found in 2020's recorded English and Welsh baby names"
  );
})();
