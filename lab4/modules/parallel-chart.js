// Global values that apply to all parallel charts
const width = 500;
const height = 250;
const margin = { top: 20, right: 150, bottom: 0, left: 150 };

export class ParallelChart {
  constructor(id, maxCount = 10) {
    this.container = d3
      .select(`#${id}`)
      .append('div')
      .classed('parallel-chart-container', true);

    this.controls = this.container
      .append('div')
      .classed('parallel-chart-controls-top', true);

    this.chart = this.container
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('parallel-chart-svg', true);

    this.maxRadius = (height - margin.top - margin.bottom) / (maxCount * 2);
    this.shelves = d3
      .range(maxCount)
      .map((_, i) => margin.top + this.maxRadius + this.maxRadius * i * 2);

    this.leftTitle = this.chart
      .append('text')
      .attr('x', this.maxRadius + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle');

    this.rightTitle = this.chart
      .append('text')
      .attr('x', width - this.maxRadius - margin.right)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle');
  }

  setLeft(data, title = '') {
    this.leftTitle.text(title);

    this.left = this.chart
      .selectAll('.leftMarker')
      .data(data)
      .join('circle')
      .attr('cx', this.maxRadius + margin.left)
      .attr('cy', (_, i) => this.shelves[i])
      .attr('r', (_, i) => this.maxRadius - i)
      .classed('leftMarker', true);

    this.chart
      .selectAll('.leftLabel')
      .data(data)
      .join('text')
      .attr('x', margin.right - 2)
      .attr('y', (_, i) => this.shelves[i])
      .text((d) => d)
      .attr('text-anchor', 'end')
      .classed('leftLabel', true);

    this.updateLinks();

    return this;
  }

  setRight(data, title = '') {
    this.rightTitle.text(title);

    this.right = this.chart
      .selectAll('.rightMarker')
      .data(data)
      .join('circle')
      .attr('cx', width - this.maxRadius - margin.right)
      .attr('cy', (_, i) => this.shelves[i])
      .attr('r', (_, i) => this.maxRadius - i)
      .classed('rightMarker', true);

    this.chart
      .selectAll('.rightLabel')
      .data(data)
      .join('text')
      .attr('x', width - margin.right + 2)
      .attr('y', (_, i) => this.shelves[i])
      .text((d) => d)
      .classed('rightLabel', true);

    this.updateLinks();

    return this;
  }

  /**
   * Updates the lines linking the LHS and RHS of the figure.
   * Links are created between matching values, to visualise any change
   * in their vertical position from left to right.
   */
  updateLinks() {
    if (!this.left || !this.right) return;

    const left = this.left.data();
    const right = this.right.data();

    // Lookup by rank index is most convenient for further use
    const links = {};
    left.forEach((value, i) => {
      const ir = right.indexOf(value);
      if (ir > -1) {
        links[i] = ir;
      }
    });

    // Add class to matched lhs values for styling possibility
    this.left.classed('marker-matched', false);
    this.left.filter((_, i) => i in links).classed('marker-matched', true);

    this.chart
      .selectAll('.link')
      .data(Object.entries(links), (d) => `${d[0]}-${d[1]}`)
      .join('line')
      .attr('x1', this.maxRadius * 2 + margin.left + 2)
      .attr('x2', width - this.maxRadius * 2 - margin.right - 2)
      .attr('y1', (d) => this.shelves[d[0]])
      .attr('y2', (d) => this.shelves[d[1]])
      .classed('link', true);
  }

  addCaption(text) {
    this.container
      .append('p')
      .text(text)
      .classed('parallel-chart-caption', true);

    return this;
  }
}
