import { ParallelChart } from './parallel-chart.js';
import { getRankedNames } from './rank-chart.js';

export class Top10Chart extends ParallelChart {
  constructor(id, data) {
    super(id);

    const top10L = getRankedNames(data, '2019', 10);
    const top10R = getRankedNames(data, '2020', 10);

    this.setLeft(Object.keys(top10L), '2019');
    this.setRight(Object.keys(top10R), '2020');
  }
}
