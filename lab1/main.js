import * as tasks from './tasks.js'

const taskIds = d3.range(1,33);

// Prepares the page for all following lab tasks (32 div elements)
d3.select('body')
  .selectAll('div')
    .data(taskIds)
  .join('div')
    // Class for styling
    .classed('exercise', true)
    // Unique ids for selection
    .attr('id', d => `task${d}`)
  // Label exercises clearly with headings
  .append('h1')
    .text(d => `Exercise ${d}`);

// The divs being selected by ID act as a local "body" for each task
for (const i of taskIds) {
  const taskId = `task${i}`;
  tasks[taskId](`#${taskId}`);
}

// Temporary while converting
exit();

// TASK 10, 14, 15 and 21 (all use same data)
(async function() {
    const data = await d3.csv('https://raw.githubusercontent.com/akmand/datasets/master/heart_failure.csv');

    const toDisplay = [
        {name: '1-30', count: 0},
        {name: '31-40', count: 0},
        {name: '41-60', count: 0},
        {name: '61-100', count: 0},
    ];

    for (const row of data) {
        // Assuming no data cleaning needed (i.e. bins nicely, nobody 100+)
        if (row.age <= 30) {
            toDisplay[0].count += 1;
        } else if (row.age <= 40) {
            toDisplay[1].count += 1;
        } else if (row.age <= 60) {
            toDisplay[2].count += 1;
        } else {
            toDisplay[3].count += 1;
        }
    }

    d3.select('#task10')
      .selectAll('p')
        .data(toDisplay)
      .join('p')
        .text(d => `Patients with heart failure, aged ${d.name}: ${d.count}`);



    // Construct the data bars
    barChart.selectAll('rect')
        .data(toDisplay)
      .join('rect')
        .attr('x', d => xAxis(d.name))
        .attr('y', d => yAxis(d.count))
        .attr('width', xAxis.bandwidth())
        .attr('height', d => height - yAxis(d.count))
        .attr('fill', d => (d.count >= 100) ? 'red' : 'blue');
})();

// TASK 11
taskData = [
    {x: [100,300], y: [100,100], color: 'red'}, // top
    {x: [300,300], y: [100,300],  color: 'blue'} , // right
    {x: [300,100], y: [300,300], color: 'yellow'}, // bottom
    {x: [100,100], y: [300,100], color: 'orange'}, // left
];

d3.select('#task11')
  .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .style('border', '1px solid green')
  .selectAll('line')
    .data(taskData)
  .join('line')
    .attr('x1', d => d.x[0])
    .attr('x2', d => d.x[1])
    .attr('y1', d => d.y[0])
    .attr('y2', d => d.y[1])
    .attr('stroke', d => d.color);

// TASK 12 and 13
d3.select('#task12')
  .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .style('border', '1px solid green')
  // Add element to be removed (demonstrate exit for TASK 13)
  .append('ellipse')
    .attr('cx', 360)
    .attr('cy', 360)
    .attr('rx', 100)
    .attr('ry', 150);

(async function() {
  const data = await d3.csv('12.csv');

  // Each shape has a different tag so must be joined separately
  const lines = data.filter(obj => obj.shape === 'line');
  const rects = data.filter(obj => obj.shape === 'rect');
  const circles = data.filter(obj => obj.shape === 'circle');
  const ellipses = data.filter(obj => obj.shape === 'ellipse');

  // Attributes order is fixed in CSV since mixing multiple shapes
  function addSvgElements(tag, data, a1, a2, a3, a4) {
    d3.select('#task12 svg')
      .selectAll(tag)
        // Data uniquely identified by composite key of attributes
        .data(data, d => `${d.shape}${d.v1}${d.v2}${d.v3}${d.v4}`)
      .join(
        enter => enter.append(tag),
        update => update,
        exit => {
          // Removed data becomes empty with dashed stroke
          exit.attr('fill-opacity', 0)
              .attr('stroke', 'black')
              .attr('stroke-width', 5)
              .attr('stroke-dasharray', 10);
        }
      )
        .attr(a1, d => d.v1)
        .attr(a2, d => d.v2)
        .attr(a3, d => d.v3)
        .attr(a4, d => d.v4)
        .attr('fill', d => d.fill)
        .attr('stroke', d => d.stroke)
        .attr('stroke-width', 5);
  }

  addSvgElements('ellipse', ellipses, 'cx', 'cy', 'rx', 'ry');
  addSvgElements('rect', rects, 'x', 'y', 'width', 'height');
  addSvgElements('line', lines, 'x1', 'x2', 'y1', 'y2');
  // Circles only have 3 attributes so using fake 4th
  addSvgElements('circle', circles, 'cx', 'cy', 'r', 'data-fake');
})();

// TASK 13
// Handled in task 12
d3.select('#task13').remove();
d3.select('#task12 h1').text('Exercises 12 and 13')

// TASK 15
// Handled in task 14
d3.select('#task15').remove();
d3.select('#task14 h1').text('Exercises 14 and 15')

// TASK 16
taskData = [10, 15, 20, 25, 30];

taskSel = d3.select('#task16')
  .append('svg')
    .attr('width', 600)
    .attr('height', 300)
  .selectAll('g')
    .data(taskData)
  .join('g');

// Original circles chart
taskSel.append('circle')
    .attr('cx',(d,i) => i * 100 + d * 2 + 5)
    .attr('cy', 100)
    .attr('r', d => d * 1.5)
    .attr('fill', (_,i) => ['blue', 'green', 'red', 'yellow', 'pink'][i]);

taskSel.append('text')
  .attr('x', (d,i) => i * 100 + d * 2 + 5)
  .attr('y', 105)
  .attr('font-size', '12px')
  .attr('font-family', 'sans-serif')
  .attr('text-anchor', 'middle')
  .text(d => d);

// Additional squares chart
taskSel.append('rect')
  .attr('x',(d,i) => i * 100 + d * 0.5 + 5)
  .attr('y', d => 200 - d * 1.5)
  .attr('width', d => d * 3)
  .attr('height', d => d * 3)
  .attr('fill', (_,i) => ['blue', 'green', 'red', 'yellow', 'pink'][i]);

taskSel.append('text')
.attr('x', (d,i) => i * 100 + d * 2 + 5)
.attr('y', 205)
.attr('font-size', '12px')
.attr('font-family', 'sans-serif')
.attr('text-anchor', 'middle')
.text(d => d);

// TASK 17, 18 and 19
d3.select('#task18').remove();
d3.select('#task19').remove();
d3.select('#task17 h1').text('Exercises 17, 18 and 19');

async function csvChart(sel, csv, useColorScale=false) {
  // Expected csv structure is single column with title 'value'
  const data = await d3.csv(csv, d => Number(d.value));

  const width = 500;
  const barHeight = 20;
  const margin = 1;

  const scale = d3.scaleLinear()
    .domain(d3.extent(data))
    .range([50, 500]);

  // Wrap svg in a div for layout
  const div = sel.append('div');

  // Differentiate plots with a heading
  div.append('h2').text(`Data from ${csv}`);

  // Insert the new svg element (more calls adds multiple)
  const svg = div.append('svg')
      .attr('width', width)
      .attr('height', barHeight * data.length);

  const g = svg.selectAll('g')
      .data(data)
    .join('g')
      .attr('transform', (_,i) => `translate(0,${i * barHeight})`);

  g.append('rect')
      .attr('width', d => scale(d))
      .attr('fill', d => (d < 100) ? 'green' : ((d > 500) ? 'red' : 'blue'))
      .attr('height', barHeight - margin);

  g.append('text')
      .attr('x', d => scale(d))
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(d => d);

  // For task 27
  if (useColorScale) {
    let colors = d3.scaleLinear()
      .domain([0, d3.mean(data), d3.max(data)])
      .range(['green','yellow','red']);

    g.select('rect').attr('fill', (d) => colors(d));
  }
}

// Call for two csv files as per task 19
csvChart(d3.select('#task17'), '19.csv');
csvChart(d3.select('#task17'), '19-2.csv');

// TASK 20 (wrapped in function to discard variables after)
(function() {
  const width = 400;
  const height = 300;
  const margin = 50;

  const taskData = [10, 15, 20, 25, 30];

  const svg = d3.select('#task20')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

  const xscale = d3.scaleLinear()
    .domain([0, d3.max(taskData)])
    .range([margin, width - margin]);

  const yscale = d3.scaleLinear()
    .domain([0, d3.max(taskData)])
    .range([height - margin, margin]);

  // Left axis
  svg.append('g')
      .attr('transform', `translate(${margin}, 0)`)
      .call(d3.axisLeft().scale(yscale));

  // Bottom axis
  svg.append('g')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(d3.axisBottom().scale(xscale));

  // Right axis
  svg.append('g')
      .attr('transform', `translate(${width - margin}, 0)`)
      .call(d3.axisRight().scale(yscale))
      // Setting color works because generated svg tags use currentColor
      .style('color', 'blue');

  // Top axis
  svg.append('g')
      .attr('transform', `translate(0, ${margin})`)
      .call(d3.axisTop().scale(xscale))
      .style('color', 'blue');
})();

// TASK 21
// Handled in task 14
d3.select('#task21').remove();
d3.select('#task14 h1').text('Exercises 14, 15 and 21')

// TASK 22
// Just defines a function in another file (line-plots.js)
d3.select('#task22').remove();

// TASK 23
(async function() {
  const data = await d3.csv('23.csv', row => {
    return { x: Number(row.x), y: Number(row.y) };
  });

  const plot_data = newPlot(data, d3.select('#task23'));

  linePlot(data, plot_data, 'black');
})();

// TASK 24
(function() {
  const numPoints = 100;
  const dataSin = [];
  const dataCos = [];
  for (let i = 0; i < numPoints; i++) {
    dataSin.push({
      x: i/100,
      y: Math.sin(6.2 * i/100)
    });

    dataCos.push({
      x: i/100,
      y: Math.cos(6.2 * i/100)
    });
  }

  const plot_data = newPlot(dataSin, d3.select('#task24'));

  linePlot(dataSin, plot_data, 'blue');
  linePlot(dataCos, plot_data, 'green');
})();

// TASK 25, 26 and 27
d3.select('#task26').remove();
d3.select('#task27').remove();
d3.select('#task25 h1').text('Exercises 25, 26 and 27');

(function() {
  const data = [
    {x:1,y:2},{x:3,y:5},{x:4,y:5},{x:7,y:10},{x:9,y:7}
  ];

  const plot_data = newPlot(data, d3.select('#task25'));

  linePlot(data, plot_data, 'red');
  addPoints(data, plot_data, 'red', 'circle');

  const data2 = [
    {x:2,y:2},{x:3,y:7},{x:4,y:6},{x:8,y:7},{x:9,y:10}
  ];

  linePlot(data2, plot_data, 'purple');
  addPoints(data2, plot_data, 'purple', 'polygon');

  // Text for 27
  plot_data.group
    .append('g')
    .selectAll('text')
      .data([data2[1], data[2]])
    .join('text')
      .text(d => `${d.x},${d.y}`)
      .attr('transform', d => {
        return `translate(${plot_data.x(d.x) + 7},${plot_data.y(d.y)})`;
      });
})();

// TASK 28
csvChart(d3.select('#task28'), '19.csv', true);

// TASK 29
(function() {
  const data = [
    {x:15,y:70},{x:40,y:65},{x:55,y:60},{x:80,y:100},{x:93,y:72}
  ];

  const plot_data = newPlot(data, d3.select('#task29'));

  linePlot(data, plot_data, 'grey');
  addPoints(data, plot_data, 'red', 'circle', true);
})();

// TASK 30 and 31
d3.select('#task31').remove();
d3.select('#task30 h1').text('Exercises 30 and 31');

(function() {
  const data = [3, 4, 8, 12];

  const xSize  = 400;
  const ySize  = 400;

  const svg = d3.select('#task30')
    .append('svg')
      .attr('width',  xSize)
      .attr('height', ySize)
    .append('g')
      .attr('transform', `translate(${xSize/2},${ySize/2})`);

  const radius = Math.min(xSize, ySize) / 2;

  const color = d3.scaleOrdinal([
    '#4daf4a',
    '#377eb8',
    '#ff7f00',
    '#984ea3',
    '#e41a1c',
  ]);

  // Generate the pie
  const pie = d3.pie();

  // Generate the arcs
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Generate groups
  const arcs = svg.selectAll('arc')
      .data(pie(data))
    .join('g')
      .attr('class', 'arc');

  // Draw arc paths
  arcs.append('path')
      .attr('fill', (_,i) => color(i))
      .attr('d', arcGenerator);

  // Add text to slice centroids for task 31
  arcs.append('text')
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .text((_,i) => data[i]);
})();

// TASK 32
(function() {
  const data = [
    {x:15,y:70},{x:40,y:65},{x:55,y:60},{x:80,y:100},{x:93,y:72}
  ];
  const png = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/768px-Yin_yang.svg.png';

  const plot_data = newPlot(data, d3.select('#task32'));

  // Add image first as background
  plot_data.group.append('svg:image')
      .attr('xlink:href', png)
      .attr('width', 520)
      .attr('height', 520);

  linePlot(data, plot_data, 'red');
})();
