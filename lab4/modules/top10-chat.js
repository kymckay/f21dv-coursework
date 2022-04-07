import { ParallelChart } from './parallel-chart.js';
import { getRankedNames } from './rank-chart.js';

// Produce list of possible year transitions to show
const years = d3.range(2020, 1996, -1);

export class Top10Chart extends ParallelChart {
  constructor(id, data) {
    super(id);

    this.select = this.controls
      .append('select')
      .classed('top10-chart-select', true)
      .on('change', (event) => this.updateColumns(event.target.value));

    this.select
      .selectAll('option')
      .data(years)
      .join('option')
      .attr('value', (d) => d)
      .text((d) => `${d - 1}–${d}`);

    this.controls
      .append('button')
      .attr('padding', '10px')
      .text('▶️')
      .on('click', () => this.autoPlay());

    this.dataset = data;
    this.updateColumns(years[0].toString());
  }

  updateColumns(year) {
    this.select.property('value', year);
    const prevYear = (Number(year) - 1).toString();

    const top10L = getRankedNames(this.dataset, prevYear, 10);
    const top10R = getRankedNames(this.dataset, year, 10);

    return this.setLeft(Object.keys(top10L), prevYear)
      .setRight(Object.keys(top10R), year)
      .updateLinks();
  }

  autoPlay() {
    // Defensive code to prevent interference
    if (this.player) return;
    this.playing = true;
    this.select.property('disabled', true);

    let chain = Promise.resolve();
    [...years].reverse().forEach((year) => {
      chain = chain.then(() => this.updateColumns(year.toString()));
    });

    chain.then(() => {
      this.playing = false;
      this.select.property('disabled', false);
    });
  }
}
