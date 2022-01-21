import { task3 } from './task3.js'

function task4(selector) {
  // Prepare the content (task 4 extends task 3)
  task3(selector);

  // Task 4 selects the first div, sets the content to start and
  // colour to purple
  d3.select(selector)
    .select('div')
      .text('start')
      .style('color', 'purple');
}

export { task4 }
