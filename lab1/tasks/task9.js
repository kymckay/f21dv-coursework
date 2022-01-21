// Only retrieve this file once ever (in ES6 module scope)
const moduleData = d3.csv('https://raw.githubusercontent.com/dsindy/kaggle-titanic/master/data/test.csv');

// d3.csv returns a promise so use async to await it
async function task9(selector) {
  const data = await moduleData;

  const aggregate = {
      passengers: data.length,
      mr_count: 0,
      mrs_count: 0,
      male: 0,
      female: 0,
      avg_fare: 0,
  }

  for (const row of data) {
      aggregate.mr_count += (row.Name.includes('Mr.'));
      aggregate.mrs_count += (row.Name.includes('Mrs.'));
      aggregate.male += (row.Sex === 'male');
      aggregate.female += (row.Sex === 'female');
      aggregate.avg_fare += Number(row.Fare) / data.length;
  }

  // Display currency value to 2dp
  aggregate.avg_fare = aggregate.avg_fare.toFixed(2);
  d3.select(selector)
    .selectAll('div')
      .data(Object.keys(aggregate))
    .join('div')
      .text(d => `${d}: ${aggregate[d]}`);
}

export { task9 }
