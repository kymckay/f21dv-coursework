// Global values that apply to all bar charts
const width = 500;
const height = 250;
const margin = { top: 10, right: 30, bottom: 30, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export class BarChart {
  constructor(id, bins = [], yRange = [0, 1]) {
    this.container = d3
      .select(`#${id}`)
      .append('div')
      .classed('bar-chart-container', true);

    this.controls = this.container
      .append('div')
      .classed('bar-chart-controls-top', true);

    this.chart = this.container
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('bar-chart-svg', true)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.xAxis = this.chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = this.chart.append('g');

    this.xScale = d3
      .scaleBand()
      .domain(bins)
      .range([0, innerWidth])
      .padding(0.2);

    this.yScale = d3.scaleLinear().domain(yRange).range([innerHeight, 0]);

    this.xAxis.call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));
  }

  updateAxes(bins, yRange) {
    this.xScale.domain(bins);
    this.yScale.domain(yRange);

    this.xAxis.transition().duration(2000).call(d3.axisBottom(this.xScale));
    this.yAxis.transition().duration(2000).call(d3.axisLeft(this.yScale));
  }

  updateBars(data) {
    this.chart
      .selectAll('rect')
      .data(data, (d) => d.x)
      .join(
        (enter) => {
          return enter
            .append('rect')
            .attr('width', this.xScale.bandwidth())
            .attr('height', 0)
            .attr('x', (d) => this.xScale(d.x))
            .attr('y', innerHeight)
            .transition()
            .duration(2000)
            .attr('y', (d) => this.yScale(d.y))
            .attr('height', (d) => innerHeight - this.yScale(d.y));
        },
        (update) => {
          return update
            .transition()
            .duration(2000)
            .attr('x', (d) => this.xScale(d.x))
            .attr('y', (d) => this.yScale(d.y))
            .attr('height', (d) => innerHeight - this.yScale(d.y));
        }
      )
      .classed('bar', true);
  }

  addCaption(text) {
    this.container.append('p').text(text).classed('chart-caption', true);

    return this;
  }
}
