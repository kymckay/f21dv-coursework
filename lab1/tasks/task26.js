import { linePlot } from './task22.js'
import { task25, addPoints } from './task25.js'

function task26(selector) {
  const plot_data = task25(selector);

  const data = [
    {x:2,y:2},{x:3,y:7},{x:4,y:6},{x:8,y:7},{x:9,y:10}
  ];

  linePlot(data, plot_data, 'purple');
  const points26 = addPoints(data, plot_data, 'purple', 'polygon');

  return { ...plot_data, points26 };
}

export { task26 }
