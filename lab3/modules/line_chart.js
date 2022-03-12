import { covidData } from "./fetchers.js";
import { addModelListener, axisTypes, updateModel } from "./model.js";

// Global values that apply to all line charts
const width = 500
const height = 250
const margin = { top: 10, right: 30, bottom: 30, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export class LineChart {
  // Holds current array of data records
  lineData;

  // Attribute on each axis
  vertical;
  horizontal;
  timeline; // Whether horizontal axis is a timeline

  // Display elements accesed and updated across methods
  xAxis;
  yAxis;
  line;
  focusCircle;
  focusText;

  // Scales may update when country changes or axes change
  xScale;
  yScale;

  constructor(elementId, defaultStat) {
    const container = d3.select(`#${elementId}`)
      .append('div')
        .classed('line-chart-container', true);

    // Allow changing the chart display
    this.vertical = defaultStat;
    container.append('select')
        .on('change', this.onVerticalSelect.bind(this))
      .selectAll('option')
        .data(axisTypes)
      .join('option')
        .attr('value', d => d)
        .property('selected', d => d === defaultStat)
        .text(d => d.split('_').join(' '));

    const chart = container
      .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .classed('svg-line-chart', true)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales are reused across event listeners
    this.yScale = d3.scaleLinear()
      .range([innerHeight, 0]);

    this.xAxis = chart.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = chart.append('g');

    this.line = chart.append('path')
      .classed('line-line', true)
      .classed(`line-${defaultStat}`, true);

    // Circle will show on mouseover, hidden initially
    this.focusCircle = chart.append('circle')
        .classed('line-highlight', true)
        .attr('r', 8.5);

    // Text of value appears on hover, above the line
    this.focusText = chart.append('text')
        .classed('line-hint', true)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle');

    addModelListener(this.onModelUpdate.bind(this));

    chart.append('rect')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .on('mousemove', this.onMouseMove.bind(this))
        .on('mouseout', () => updateModel({brushedValue: null}));
  }

  updateHorizontalAxis() {
    // Only date dimension is non-numeric
    this.xScale = this.timeline ? d3.scaleTime() : d3.scaleLinear();
    this.xScale.range([0, innerWidth]);

    // Use full extent of x-axis for consistency across line charts
    this.xScale.domain(d3.extent(this.lineData, d => d[this.horizontal]));

    const x = d3.axisBottom(this.xScale)

    // Prevent large numeric values from creating long tick labels
    if (!this.timeline) {
      x.ticks(null, 's');
    }

    this.xAxis.transition()
      .duration(2000)
      .call(x);
  }

  updateVerticalAxis() {
    // Quantity of interest should always be shown with respect to 0
    this.yScale.domain([0, d3.max(this.lineData, d => d[this.vertical])])
    this.yAxis.transition()
      .duration(2000)
      .call(d3.axisLeft(this.yScale));
  }

  updateLine() {
    // Not all records will have both data dimensions present
    // Compare to null to keep values of 0
    this.line.datum(this.lineData.filter(d =>
      d[this.vertical] != null
      && d[this.horizontal] != null
    ));

    // Collapse existing line first to avoid density change artifacts
    // (some still occur, but not as bad)
    this.line
      .transition()
        .duration(1000)
        .attr('d',
          d3.line()
            .x(d => this.xScale(d[this.horizontal]))
            .y(() => this.yScale(this.yScale.domain()[0]))
        )
      .transition()
        .duration(1000)
        .attr('d',
          d3.line()
            .x(d => this.xScale(d[this.horizontal]))
            .y(d => this.yScale(d[this.vertical]))
        );
  }

  highlightPoint(brushedValue) {
    const {
      horizontal,
      vertical,
      focusCircle,
      focusText
    } = this;

    // Value set to null when mouse leaves chart
    if (!brushedValue) {
      this.showHighlight(false);
      return;
    }

    const data = this.line.datum();

    if (!data.length) {
      this.showHighlight(false);
      return;
    }

    // Only highlight if datapoint exists aligned with cursor
    if (
      brushedValue < data[0][horizontal]
      || brushedValue > data[data.length-1][horizontal]
    ) {
      focusText.classed('visible', false);
      focusCircle.classed('visible', false);
      return;
    }

    // Find closest data point to left of brushed time
    const bisect = d3.bisector(d => d[horizontal]).left
    const index = bisect(data, brushedValue);
    const datapoint = data[index];

    if (!datapoint) {
      this.showHighlight(false);
      return;
    }

    // Convert back to range coordinate space to position elements
    const x_scaled = this.xScale(datapoint[horizontal]);
    const y_scaled = this.yScale(datapoint[vertical]);

    focusCircle
        .attr('cx', x_scaled)
        .attr('cy', y_scaled);
    focusText
        .attr('x', x_scaled)
        .attr('y', y_scaled - 15)
        .text(datapoint[vertical].toLocaleString());

    this.showHighlight(true);
  }

  updateChart(hAxis, vAxis, line) {
    if (hAxis) this.updateHorizontalAxis();
    if (vAxis) this.updateVerticalAxis();
    if (line) this.updateLine();
  }

  onVerticalSelect(event) {
    this.vertical = event.target.value;
    this.updateChart(false, true, true);
  }

  async onModelUpdate(changes) {
    const { axisValue, selectedCountry } = changes;
    let updateVert = false;
    let updateHori = false;
    let updateLine = false;

    if (selectedCountry) {
      const allData = await covidData();
      const countryInfo = allData[selectedCountry];
      this.lineData = countryInfo.data;

      updateVert = true;
      updateHori = true;
      updateLine = true;
    }

    if (axisValue) {
      this.horizontal = axisValue;
      this.timeline = this.horizontal === 'date';

      updateHori = true;
      updateLine = true;
    }

    this.updateChart(updateHori, updateVert, updateLine);

    // Brushed value can be null to represent no value
    if ('brushedValue' in changes) {
      this.highlightPoint(changes.brushedValue);
    }
  }

  onMouseMove(event) {
    // Need x-value of mouse position in domain coordinate space
    const [x_mouse] = d3.pointer(event);
    const x_value = this.xScale.invert(x_mouse);

    updateModel({brushedValue: x_value});
  }

  showHighlight(show) {
    this.focusText.classed('visible', show);
    this.focusCircle.classed('visible', show);
  }
}
