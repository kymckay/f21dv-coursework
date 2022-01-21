const moduleData = d3.csv('https://raw.githubusercontent.com/akmand/datasets/master/heart_failure.csv');

async function taskData() {
  const data = await moduleData;

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

  return toDisplay;
}

async function task10(selector) {
  const data = await taskData();

  d3.select(selector)
    .selectAll('p')
      .data(data)
    .join('p')
      .text(d => `Patients with heart failure, aged ${d.name}: ${d.count}`);
}

export { taskData, task10 }
