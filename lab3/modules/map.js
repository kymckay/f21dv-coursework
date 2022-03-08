import { covidData, geoData } from "./fetchers.js";
import { updateModel } from "./model.js";

/**
 * Loads world GeoJSON and adds a static (non-slippy) map to the page
 * with interactivity.
 */
export async function makeMap() {
  const svg = d3.select('#map')
    .append('svg')
      .attr('viewBox', '0 0 600 400')
      .attr('width', 800)
      .attr('height', 600);

  // Mercator projection is familiar to most because so widly used
  // Want to scale as large as convenient for easier interaction
  // Translate to center the geometry in the viewbox
  const projection = d3.geoMercator()
    .scale(90)
    .center([0,20])
    .translate([300, 250]);

  const worldGeoData = await geoData();
  const worldCovidData = await covidData();

  // Colouring countries by covid cases to show regional influence
  // Using 0.9 quantile to reduce influence of outliers on colouring
  const countryMax = d3.quantile(Object.keys(worldCovidData), 0.9, k => {
    const countryInfo = worldCovidData[k];
    const latestStats = countryInfo.data[countryInfo.data.length - 1];

    // Using normalised data for a consistent scale
    return latestStats.total_cases_per_million;
  });
  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, countryMax]);

  // Construct global map from GeoJSON features, these contain ISO code
  // for later joining with COVID-19 data (which I use as the ID here).
  svg.append('g')
    .selectAll('path')
      .data(worldGeoData.features, d => d.properties.iso_a3)
    .join('path')
      .attr('d', d3.geoPath().projection(projection))
      .attr('fill', d => {
        const countryInfo = worldCovidData[d.properties.iso_a3];

        // Some countries have no data available
        if (!countryInfo) return colorScale(0);

        const latestStats = countryInfo.data[countryInfo.data.length - 1];
        return colorScale(latestStats.total_cases_per_million);
      })
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

  async function onClick(_, data) {
    const iso_code = data.properties.iso_a3;
    updateModel('selectedCountry', iso_code);
  }
}
