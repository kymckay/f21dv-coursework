import { covidData } from "./fetchers.js";

export class ClusterChart {
  constructor(elementId, x, y) {
    this.x = x;
    this.y = y;

    const width = 500
    const height = 250
    const margin = { top: 10, right: 30, bottom: 30, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    this.chart = d3.select(`#${elementId}`)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('svg-clustered', true)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales are reused across event listeners
    this.xScale = d3.scaleLinear()
      .range([0, innerWidth]);

    this.yScale = d3.scaleLinear()
      .range([innerHeight, 0]);

    this.xAxis = this.chart.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);

    this.yAxis = this.chart.append('g');
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
    this.chart
      .append('g')
      .selectAll('circle')
        .data(this.vectors)
      .join('circle')
        .attr('cx', d => this.xScale(d.x))
        .attr('cy', d => this.yScale(d.y))
        .attr('r', 2)
        .attr('fill', d => this.colorScale(d.cluster))
        .attr('fill-opacity', 0.8);

    this.xAxis.call(d3.axisBottom(this.xScale).ticks(6, 's'));
    this.yAxis.call(d3.axisLeft(this.yScale));
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