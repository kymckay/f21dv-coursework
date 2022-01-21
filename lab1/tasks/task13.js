import { task12 } from './task12.js'

function joinData(svg) {
  // This top left circle already exists
  const data = [ { shape: 'circle', v1: '20', v2: '27', v3: '10' } ];

  // The existing circle will turn green over 2s
  // The other circle which no longer exists will become a dashed outline
  svg.selectAll('circle')
      // This form of key will match existing data
      .data(data,  d => `${d.shape}${d.v1}${d.v2}${d.v3}`)
  .join(
    enter => enter.append('circle'),
    update => {
      update.transition()
        .duration(2000)
        .attr('fill', 'green');
    },
    exit => {
      // Removed data becomes empty with dashed stroke
      exit.attr('fill-opacity', 0)
          .attr('stroke', 'black')
          .attr('stroke-width', 5)
          .attr('stroke-dasharray', 10);
    }
  );
}

async function task13(selector) {
  // Prepare SVG with existing elements to demonstrate update and exit
  const svg = await task12(selector);

  d3.select(selector)
    .append('button')
    .text('Apply new circle data')
    .on('click', () => joinData(svg));


  d3.select(selector)
    .append('p')
      .text('The right circle will "exit" and the top left will "update".');
}

export { task13 }
