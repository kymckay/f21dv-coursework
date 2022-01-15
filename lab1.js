// Variables to be reused between tasks so data is garbage collected
let taskData;
let taskSel;

// Prepares the page for all following lab tasks (32 div elements)
d3.select('body')
  .selectAll('div')
    .data(Array(32).keys())
  .join('div')
    .attr('class', d => `task${d+1}`)

// Label tasks clearly with headings
  .append('h1')
    .text(d => `Task ${d + 1}`);

// TASK 1
d3.select('.task1').append('p')
    .text(`d3.version: ${d3.version}`);

// TASK 2
// Add indexed paragraph elements
taskSel = d3.select('.task2')
  .selectAll('div')
    .data(Array(2).keys())
  .join('p')
    .text(d => `Paragraph ${d}`);

// Demonstrate changing paragraph via select
taskSel.select('p')
    .style('color', 'red')
    .style('font-family', 'Mono')
    .style('font-size', '18pt');
taskSel.insert('p', 'p').text('Demonstrating d3.select():');

// TASK 3
// Making required 10 div elements using join instead of
// appending in a loop as requested because it makes more sense.
taskSel = d3.select('.task3')
  .selectAll('div')
    .data(Array(10).keys())
  .join('div')
    .text(d => d);

// Also part of task 3, first 5 are red and last 5 are green.
taskSel.filter((_,i) => i < 5).style('color', 'red');
taskSel.filter((_,i) => i >= 5).style('color', 'green');

// TASK 4
// Re-uses task 3 elements
d3.select('.task4').remove();
d3.select('.task3 h1').text('Tasks 3 and 4')

// Task 4 selects the first div, sets the content to start and
// colour to purple
d3.select('.task3')
  .select('div')
    .text('start')
    .style('color', 'purple');

// TASK 5
d3.select('.task5')
  .append('div')
    .text('Hello world!')
    .style('color', 'green');

// TASK 6
taskData = [
    {name:'test', val:1, color: 'blue'},
    {name:'other', val:2, color: 'red'},
    {name:'b', val:3, color:'yellow'}
];

d3.select('.task6')
  .selectAll('div')
    .data(taskData)
  .join('div')
    .text(d => d.color);

// TASK 7
taskData = [10, 50, 60, 75, 100, 200];

d3.select('.task7')
  .selectAll('div')
    .data(taskData)
  .join('div')
    .text(d => `cont:${d}`)
    .style('color', d => {
        if (d >= 100) {
            return 'blue';
        } else if (d > 50) {
            return 'red';
        } else {
            return 'yellow';
        }
    });

// TASK 8
taskData = ['a', 4, 1, 'b', 6, 2, 8, 9, 'z'];

d3.select('.task8')
  .selectAll('span')
    .data(taskData)
  .join('span')
    .text(d => d)
    .style('color',
        d => (typeof(d) === 'string') ? 'blue' : 'green'
    );

// TASK 9
// Because d3.csv is asynchronous using immediately invoked async
// function to conveniently await and handle data
(async function() {
    const data = await d3.csv('https://raw.githubusercontent.com/dsindy/kaggle-titanic/master/data/test.csv');

    const aggregate = {
        passengers: data.length,
        mr_count: 0,
        mrs_count: 0,
        male: 0,
        female: 0,
        avg_fare: 0,
    }

    for (const row of data) {
        aggregate.mr_count += (row.Name.includes('Mr.')) ? 1 : 0;
        aggregate.mrs_count += (row.Name.includes('Mrs.')) ? 1 : 0;
        aggregate.male += (row.Sex === 'male') ? 1 : 0;
        aggregate.female += (row.Sex === 'female') ? 1 : 0;
        aggregate.avg_fare += row.Fare / data.length;
    }

    // Display currency value to 2dp
    aggregate.avg_fare = aggregate.avg_fare.toFixed(2);
    d3.select('.task9')
      .selectAll('div')
        .data(Object.keys(aggregate))
      .join('div')
        .text(d => `${d}: ${aggregate[d]}`);
})();

// TASK 10
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

    d3.select('.task10')
      .selectAll('p')
        .data(toDisplay)
      .join('p')
        .text(d => `Patients with heart failure, aged ${d.name}: ${d.count}`);
})();

// TASK 11
taskData = [
    {x: [100,300], y: [100,100], color: 'red'}, // top
    {x: [300,300], y: [100,300],  color: 'blue'} , // right
    {x: [300,100], y: [300,300], color: 'yellow'}, // bottom
    {x: [100,100], y: [300,100], color: 'orange'}, // left
];

d3.select('.task11')
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
d3.select('.task12')
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
  const data = await d3.csv('lab1svg.csv');

  // Each shape has a different tag so must be joined separately
  const lines = data.filter(obj => obj.shape === 'line');
  const rects = data.filter(obj => obj.shape === 'rect');
  const circles = data.filter(obj => obj.shape === 'circle');
  const ellipses = data.filter(obj => obj.shape === 'ellipse');

  // Attributes order is fixed in CSV since mixing multiple shapes
  function addSvgElements(tag, data, a1, a2, a3, a4) {
    d3.select('.task12 svg')
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
d3.select('.task13').remove();
d3.select('.task12 h1').text('Tasks 12 and 13')
