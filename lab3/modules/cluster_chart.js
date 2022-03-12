import { covidData } from "./fetchers.js";
import { addModelListener, updateModel } from "./model.js";

const width = 500
const height = 250
const margin = { top: 10, right: 30, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export class ClusterChart {
  // Will store coordinates when brushing started
  mouseDown;

  constructor(elementId, x, y) {
    this.x = x;
    this.y = y;

    const container = d3.select(`#${elementId}`)
      .append('div')
      .classed('cluster-chart', true);

    const svg = container.append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('svg-clustered', true);

    this.chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales are reused across event listeners
    this.xScale = d3.scaleLinear()
      .range([0, innerWidth]);

    this.yScale = d3.scaleLinear()
      .range([innerHeight, 0]);

    this.xAxis = this.chart.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = this.chart.append('g');

    this.selectBox = this.chart.append('rect')
        .classed('scatter-box', true);

    // Add an x-axis label under the chart
    svg.append('text')
        .text(x.split('_').join(' '))
        .attr('text-anchor', 'middle')
        .attr('x', margin.left + innerWidth / 2)
        .attr('y', height - 5);

    // Add a y-axis label to the left
    svg.append('text')
        .text(y.split('_').join(' '))
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(20,${margin.top + innerHeight / 2}) rotate(-90)`);
  }

  // Performs k-means clustering and updates the chart
  async cluster(numClusters) {
    const data = await covidData();

    const vectors = Object.keys(data).map(k => {
      // Ignore special entries, they're not comparable
      if (k.startsWith('OWID')) return null;

      // Taking copy to order data from newest to oldest non-destructively
      const allStats = data[k].data.slice().reverse();
      // Need to find latest statistic with both attributes present
      const latestIndex = allStats.findIndex(d => {
        return (
          // Compare to null to allow for values of 0
          d[this.x] != null
          && d[this.y] != null
        )
      })
      const latestStats = allStats[latestIndex];

      // Some countries may not have information available
      if (!latestStats) return null;

      return {
        label: data[k].location,
        x: latestStats[this.x],
        y: latestStats[this.y],
      };
    }).filter(d => d);

    // ==== Perform the k-means algorithm ====
    // First need k initial means (using Forgy method)
    const means = d3.range(numClusters).map(i =>  ({ ...vectors[i] }));

    // Repeate until centroids converge
    let meansMoved = true;
    while (meansMoved) {
      // Now assign each vector the nearest mean
      vectors.forEach(v => {
        const dists = [];
        for (let i = 0; i < means.length; i++) {
          const {x: mx, y: my} = means[i];
          dists[i] = (v.x -  mx) ** 2 + (v.y - my) ** 2
        }

        // Assign the vector to a cluster (identified by index)
        v.cluster = dists.indexOf(Math.min(...dists));
      });

      // Prepare to check if any means have updated
      meansMoved = false;
      const oldMeans = means.slice();

      // Now recalculate the means
      for (let i = 0; i < means.length; i++) {
        const inCluster = vectors.filter(v => v.cluster === i);
        means[i].x = average(inCluster.map(v => v.x));
        means[i].y = average(inCluster.map(v => v.y));

        if (means[i].x !== oldMeans[i].x
          && means[i].y !== oldMeans[i].y
        ) {
          meansMoved = true;
        }
      }
    }

    // Some outliers blow up the scale, ignore them
    this.xScale.domain([0, d3.quantile(vectors, 0.75, d => d.x)]);
    this.yScale.domain(d3.extent(vectors, d => d.y));
    this.colorScale = d3.scaleOrdinal(d3.schemeSet1)
      .domain(d3.range(numClusters));

    this.centroids = means;
    this.vectors = vectors;
    this.update();
  }

  update() {
    this.points = this.chart
      .append('g')
      .selectAll('circle')
        .data(this.vectors)
      .join('circle')
        .attr('cx', d => this.xScale(d.x))
        .attr('cy', d => this.yScale(d.y))
        .attr('r', 2)
        .attr('fill-opacity', 0.8);

    this.xAxis.call(d3.axisBottom(this.xScale).ticks(6, 's'));
    this.yAxis.call(d3.axisLeft(this.yScale).ticks(6, 's'));

    this.chart.append('rect')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .on('mousedown', this.onMouseDown.bind(this))
        .on('mouseup', this.onMouseUp.bind(this))
        .on('mousemove', this.onMouseMove.bind(this))
        .on('mouseout', this.onMouseUp.bind(this));

    addModelListener(this.onModelUpdate.bind(this));
  }

  onMouseDown(event) {
    const [x,y] = d3.pointer(event);
    this.mouseDown = [x, y];
    this.selectBox
        .attr('width', 0)
        .attr('height', 0);
    this.selectBox.classed('visible', true);
  }

  onMouseUp() {
    this.mouseDown = null;
    this.selectBox.classed('visible', false);
  }

  onMouseMove(event) {
    if (this.mouseDown) {
      const [x,y] = d3.pointer(event);
      const [mx, my] = this.mouseDown;

      const [xl, xr] = [
        Math.min(x, mx),
        Math.max(x, mx),
      ];
      const [yt, yb] = [
        Math.min(y, my),
        Math.max(y, my),
      ];

      // Box dimensions can't go negative
      this.selectBox
        .attr('x', xl)
        .attr('y', yt)
        .attr('width', xr - xl)
        .attr('height', yb - yt);

      // Need box bounds in original scales to find points within
      const [xlp, xrp] = [
        this.xScale.invert(xl),
        this.xScale.invert(xr),
      ];

      const [ytp, ybp] = [
        this.yScale.invert(yt),
        this.yScale.invert(yb),
      ];

      // The points that lie in the dragged rectangle to are brushed
      const brushed = this.vectors.filter(v => {
        return (
          (v.x > xlp && v.x < xrp)
          && (v.y < ytp && v.y > ybp)
        );
      });

      updateModel({brushedCountries: brushed.map(v => v.label)});
    }
  }

  onModelUpdate(changes) {
    // Avoid frequent expensive updates when unchanged
    if ('brushedCountries' in changes) {
      const { brushedCountries } = changes;

      this.points.attr('fill', d => {
        if (brushedCountries && brushedCountries.includes(d.label)) {
          return 'white';
        } else {
          return this.colorScale(d.cluster);
        }
      })
    }
  }
}

/**
 * Finds the average of an array of numbers, rounding to 2 decimal places
 * @param {number[]} values array of numbers
 */
function average(values) {
  // Cumulative moving average
  const avg = values.reduce((pv, cv, i) => pv + (cv - pv)/(i+1), 0);

  // Want to enforce decimal places so clustering converges
  return Number(avg.toFixed(2));
}
