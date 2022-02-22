function task24(selector) {
  const intr = d3.interpolate([20, 40, 4], [1, 12, 10]);

  d3.select(selector)
    .append('p')
      .text(`Type of returned function is: ${typeof(intr)}. Applied to 0.2 gives: ${intr(0.2)}.`);
}

export { task24 }
