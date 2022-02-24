function task26(selector) {
  const itp = d3.interpolateDate(
    new Date(0), Date.now()
  )

  d3.select(selector)
    .append('p')
      .html(`Interpolated date half way from the Unix epoch (<code>1970-01-01T00:00:00Z</code>) until this moment: <code>${itp(0.5).toISOString()}</code>.`);
}

export { task26 }
