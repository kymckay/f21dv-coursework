function task6(selector) {
  const data = [
    {name:'test', val:1, color: 'blue'},
    {name:'other', val:2, color: 'red'},
    {name:'b', val:3, color:'yellow'}
  ];

  d3.select(selector)
  .selectAll('div')
    .data(data)
  .join('div')
    .text(d => d.color);
}

export { task6 }
