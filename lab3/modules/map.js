/**
 * Loads world GeoJSON and adds a static (non-slippy) map to the page
 * with interactivity.
 */
export async function makeMap() {
  // Using viewbox for sizing so map can otherwise scale to screen
  const svg = d3.select('#map')
    .append('svg')
      .attr('viewBox', '0 0 600 400');

  // Mercator projection is familiar to most because so widly used
  // Want to scale as large as convenient for easier interaction
  // Translate to center the geometry in the viewbox
  const projection = d3.geoMercator()
    .scale(90)
    .center([0,20])
    .translate([300, 250]);

  const worldGeoData = await d3.json('world.json');

  // TODO: Replace random colouring with something informative
  const colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain(d3.extent(worldGeoData.features, d => d.properties.iso_n3));

  // Construct global map from GeoJSON features, these contain ISO code
  // for later joining with COVID-19 data (which I use as the ID here).
  svg.append('g')
    .selectAll('path')
      .data(worldGeoData.features, d => d.properties.iso_a3)
    .join('path')
      .attr('d', d3.geoPath().projection(projection))
      .attr('fill', d => colorScale(d.properties.iso_n3))
      .on('mouseenter', onMouseEnter)
      .on('mouseleave', onMouseLeave)
      .on('click', onClick);

  function onMouseEnter() {
    d3.select(this)
      .attr('fill-opacity', 0.5);
  }

  function onMouseLeave() {
    d3.select(this)
      .attr('fill-opacity', null);
  }

  function onClick(_, data) {
    console.log(data.properties);
  }
}
