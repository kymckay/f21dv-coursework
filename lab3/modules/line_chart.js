import { covidData } from "./fetchers.js";
import { addModelListener, updateModel } from "./model.js";

export class LineChart {
  constructor(elementId, defaultStat) {
    const width = 500
    const height = 250
    const margin = { top: 10, right: 30, bottom: 30, left: 100 };

    this.innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    this.covidStat = defaultStat;

    this.chart = d3.select(`#${elementId}`)
      .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .classed('svg-line-chart', true)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales are reused across event listeners
    this.yScale = d3.scaleLinear()
      .range([innerHeight, 0]);

    this.xAxis = this.chart.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = this.chart.append('g');

    this.line = this.chart.append('path')
      .classed('line-line', true)
      .classed(`line-${defaultStat}`, true);

    // Circle will show on mouseover, hidden initially
    this.focus_circle = this.chart
      .append('circle')
        .classed('line-highlight', true)
        .attr('r', 8.5);

    // Text of value appears on hover, above the line
    this.focus_text = this.chart
      .append('text')
        .classed('line-hint', true)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle');

    this.chart.append('rect')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('width', this.innerWidth)
        .attr('height', innerHeight)
        .on('mousemove', this.onMouseMove.bind(this))
        .on('mouseout', () => updateModel('brushedValue', null));

    addModelListener('axisValue', this.updateHorizontalAxis.bind(this));
    addModelListener('selectedCountry', this.updateCasesChart.bind(this));
    addModelListener('brushedValue', this.highlightPoint.bind(this));
  }

  updateHorizontalAxis(model) {
    const { axisValue } = model;

    // Only date dimension is non-numeric
    this.xScale = axisValue === 'date' ? d3.scaleTime() : d3.scaleLinear();
    this.xScale.range([0, this.innerWidth]);

    this.updateCasesChart(model);
  }

  onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = this.xScale.invert(x_mouse);

    updateModel('brushedValue', x_value);
  }

  async updateCasesChart(model) {
    const { axisValue, selectedCountry } = model;
    const { xScale, yScale, xAxis, yAxis, line, covidStat } = this;
    const country = (await covidData())[selectedCountry];

    // Prevent large numeric values from creating long tick labels
    const x = d3.axisBottom(xScale)
    if (axisValue !== 'date') {
      x.ticks(null, 's');
    }

    // Use full extent of x-axis for consistency across line charts
    xScale.domain(d3.extent(country.data, d => d[axisValue]));
    xAxis.transition()
      .duration(2000)
      .call(x);

    // Quantity of interest should always be shown with respect to 0
    yScale.domain([0, d3.max(country.data, d => d[covidStat])])
    yAxis.transition()
      .duration(2000)
      .call(d3.axisLeft(yScale));

    // Not all records will have both data dimensions present
    // Compare to null to keep values of 0
    line.datum(country.data.filter(d =>
      d[covidStat] != null
      && d[axisValue] != null
    ))
      .transition()
        .duration(2000)
        .attr('d', d3.line()
          .x(d => xScale(d[axisValue]))
          .y(d => yScale(d[covidStat]))
        );
  }

  highlightPoint(model) {
    const { axisValue, brushedValue } = model;
    const {
      covidStat,
      focus_circle,
      focus_text,
      line,
      xScale,
      yScale,
    } = this;

    // Value set to null when mouse leaves chart
    if (!brushedValue) {
      focus_text.classed('visible', false);
      focus_circle.classed('visible', false);
      return;
    }

    const data = line.datum();

    // Only highlight if datapoint exists aligned with cursor
    if (
      brushedValue < data[0][axisValue]
      || brushedValue > data[data.length-1][axisValue]
    ) {
      focus_text.classed('visible', false);
      focus_circle.classed('visible', false);
      return;
    }

    // Find closest data point to left of brushed time
    const bisect = d3.bisector(d => d[axisValue]).left
    const index = bisect(data, brushedValue);
    const datapoint = data[index];

    if (!datapoint) return;

    // Convert back to range coordinate space to position elements
    const x_scaled = xScale(datapoint[axisValue]);
    const y_scaled = yScale(datapoint[covidStat]);

    focus_circle
        .attr('cx', x_scaled)
        .attr('cy', y_scaled);
    focus_text
        .attr('x', x_scaled)
        .attr('y', y_scaled - 15)
        .text(datapoint[covidStat].toLocaleString());

    focus_text.classed('visible', true);
    focus_circle.classed('visible', true);
  }
}
