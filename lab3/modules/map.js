/**
 * Add a leaflet map to the page element with ID `map`.
 * Loads world geoJSON and handles country highlighting.
 */
export async function makeMap() {
  const map = L.map('map', {center: [20,0], zoom: 3});

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const countries = await d3.json('world.json');

  // Use Leaflet to automatically handle geoJSON with slippy map
  L.geoJson(countries, {
    style: () => ({ fillColor: 'red', opacity: 0, fillOpacity: 0}),
    onEachFeature: function(_, layer) {
      layer.on({
        mouseover: onMouseOver,
        mouseout: onMouseOut
      })
    }
  }).addTo(map);

  function onMouseOver(event) {
    const { target } = event;

    target.setStyle({
      fillOpacity: 0.2,
    })
  }

  function onMouseOut(event) {
    const { target } = event;

    target.setStyle({
      fillOpacity: 0,
    })
  }
}
