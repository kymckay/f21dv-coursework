import { covidData, geoData } from "./fetchers.js";
import { addModelListener, updateModel } from "./model.js";

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

  const allCountryStats = Object.keys(worldCovidData).map(k => {
    const countryInfo = worldCovidData[k];
    const latestStats = countryInfo.data[countryInfo.data.length - 1];

    // Using normalised data for a consistent scale
    return latestStats.total_cases_per_million;
  })

  // Colouring countries by covid cases to show regional influence
  // Using 0.9 quantile to reduce influence of outliers on colouring
  const countryMax = d3.quantile(allCountryStats, 0.9);
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

  const legend = L.control({position: 'bottomleft'});

  // Add legend to map
  legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');

      // Divide the data range into suitable quantiles
      const grades = [
        0,
        d3.quantile(allCountryStats, 0.25),
        d3.quantile(allCountryStats, 0.5),
        d3.quantile(allCountryStats, 0.75),
        d3.quantile(allCountryStats, 0.9)
      ];

      function formatNum(number) {
        return (Math.round(number / 1000) * 1000).toLocaleString()
      }

      // Construct a legend of coloured squares and the ranges they correspond to
      const sel = d3.select(div);
      for (var i = 0; i < grades.length; i++) {
        sel.append('i')
          .style('background', colorScale(grades[i] + 1));

        // Adds label either to next quantile or a + symbol for final
        sel.html(sel.html() +
          `${formatNum(grades[i])}${grades[i + 1] ? `–${formatNum(grades[i + 1])}` : '+'}`
        )

        if (grades[i + 1]) {
          sel.append('br');
        }
      }

      return div;
  };

  legend.addTo(map);

  // Hover information control
  var info = L.control({position: 'topright'});
  info.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-info');
    return div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = country => {
    const div = d3.select(info.getContainer());
    const latestStats = country.data[country.data.length - 1];

    div.html(
      '<h4>Cases per million</h4>'
      + `<b>${country.location}</b><br/>` +
      `${Math.round(latestStats.total_cases_per_million).toLocaleString()}`
    );
  };

  info.addTo(map);
  addModelListener('hoveredCountry', (iso_code) => {
    info.update(worldCovidData[iso_code ?? 'OWID_WRL']);
  })

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
