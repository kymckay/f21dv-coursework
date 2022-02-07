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
