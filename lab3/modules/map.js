import { covidData, geoData } from "./fetchers.js";
import { updateModel } from "./model.js";

/**
 * Loads world GeoJSON and adds a slippy map to the page
 * with interactivity.
 */
export async function makeMap() {
  // Slippy map allows for more interaction than anything static,
  // particularly when dealing with the whole world
  const map = L.map('map', {
    center: [20,0],
    maxBoundsViscosity: 0.5,
    // Allow zooming in a reasonable range
    maxZoom: 9,
    minZoom: 2,
    zoom: 2
  });

  // Must attribute background tiles appropriately
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

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
  updateModel('mapColors', colorScale);

  const geoLayer = L.geoJson(worldGeoData, {
    style: feature => {
      const countryInfo = worldCovidData[feature.properties.iso_a3];

      // Some countries have no data available
      let fillColor;
      if (!countryInfo) {
        fillColor = colorScale(0);
      } else {
        const latestStats = countryInfo.data[countryInfo.data.length - 1];
        fillColor = colorScale(latestStats.total_cases_per_million);
      }

      return {
        fillColor,
        fillOpacity: 0.4,
        color: 'lightgrey',
        weight: 0.8,
      }
    },
    onEachFeature: function(_, layer) {
      layer.on({
        mouseover: onMouseEnter,
        mouseout: onMouseLeave,
        click: onClick,
      })
    }
  }).addTo(map);

  // Constrain map to the GeoJson
  map.setMaxBounds(geoLayer.getBounds())

  // Add scalar data as circle marker representation over map
  const markers = []
  const markerScale = d3.scaleSequential()
    .domain([0, countryMax])
    .range([5, 20]);
  geoLayer.eachLayer(layer => {
    const iso_code = layer.feature.properties.iso_a3;
    const countryInfo = worldCovidData[iso_code];
    if (!countryInfo) return;

    const latestStats = countryInfo.data[countryInfo.data.length - 1];

    markers.push(
      L.circleMarker(
        layer.getCenter(),
        {
          radius: markerScale(latestStats.total_cases_per_million),
          fillColor: colorScale(latestStats.total_cases_per_million),
          fillOpacity: 0.1,
          weight: 2,
          color: colorScale(latestStats.total_cases_per_million),
          // Don't want bubbles to interfere with interaction
          interactive: false,
        },
      )
    );
  })
  L.featureGroup(markers).addTo(map);

  function onMouseEnter(event) {
    const { target } = event;

    target.setStyle({
      fillOpacity: 0.2,
    });

    updateModel('hoveredCountry', target.feature.properties.iso_a3);
  }

  function onMouseLeave(event) {
    const { target } = event;

    target.setStyle({
      fillOpacity: 0.5,
    });

    updateModel('hoveredCountry', null);
  }

  async function onClick(event) {
    const { feature } = event.target;
    // Update the model with the GeoJSON feature's ISO code
    updateModel('selectedCountry', feature.properties.iso_a3);
  }
}
