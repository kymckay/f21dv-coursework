// Global values that apply to all line charts
const width = 500;
const height = 250;
const margin = { top: 10, right: 30, bottom: 30, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export class LineChart {
  constructor(id, xRange, yRange, isTimeline = false, invertY = false) {
    this.container = d3
      .select(`#${id}`)
      .append('div')
      .classed('line-chart-container', true);

    this.controls = this.container
      .append('div')
      .classed('line-chart-controls-top', true);

    this.chart = this.container
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('line-chart-svg', true)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.xAxis = this.chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = this.chart.append('g');

    this.xScale = (isTimeline ? d3.scaleTime() : d3.scaleLinear())
      .domain(xRange)
      .range([0, innerWidth]);

    this.yScale = d3
      .scaleLinear()
      .domain(yRange)
      .range(invertY ? [0, innerHeight] : [innerHeight, 0]);

    this.xAxis.append('g').call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));
  }

  /**
   * Adds a new line to the chart
   * @param {object[]} data array of objects with x and y attributes
   */
  addLine(data, curve = d3.curveLinear) {
    return this.chart
      .append('path')
      .datum(data)
      .attr(
        'd',
        d3
          .line()
          .curve(curve)
          .x((d) => this.xScale(d.x))
          .y((d) => this.yScale(d.y))
      )
      .classed('line', true);
  }

  addCaption(text) {
    this.container.append('p').text(text).classed('chart-caption', true);

    return this;
  }

  addTitle(text) {
    this.chart
      .append('text')
      .attr('y', -3)
      .attr('x', -10)
      .text(text)
      .classed('line-chart-title', true);

    return this;
  }
}
