function task25(selector) {
  const cc = d3.interpolate('red', 'green')

  d3.select(selector)
    .append('p')
      .text(`Interpolated colour value: ${cc(0.5)}.`);
}

export { task25 }
