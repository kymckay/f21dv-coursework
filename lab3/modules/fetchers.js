let _covidDataRequest;

/**
 * Lazy loader for COVID-19 data
 * @returns Promise for global COVID-19 data
 */
export async function covidData() {
  if (_covidDataRequest) return await _covidDataRequest;

  _covidDataRequest = d3.json('owid-covid-data.json')
    // Convert dates from strings to objects for later use
    .then(data => {
      for (const key in data) {
        data[key].data = data[key].data.map(d => {
          d.date = new Date(d.date);
          return d;
        })
      }

      return data;
    });

  return _covidDataRequest;
}


let _geoDataRequest;

/**
 * Lazy loader for world GeoJSON data
 * @returns Promise for world GeoJSON data
 */
export async function geoData() {
  if (_geoDataRequest) return await _geoDataRequest;
  _geoDataRequest = d3.json('world.json');
  return _geoDataRequest;
}

let _vaccineDataRequest;

/**
 * Lazy loader for COVID-19 vaccination data
 * @returns Promise for global COVID-19 vaccination data
 */
export async function vaccineData() {
  if (_vaccineDataRequest) return await _vaccineDataRequest;

  _vaccineDataRequest = d3.json('vaccinations.json')
    // Once fetched, want data to be accessible by ISO code keys
    .then(data => data.reduce((pv, cv) => {
      // Convert dates from strings to objects for later use
      pv[cv.iso_code] = cv.data.map(d => {
        d.date = new Date(d.date);
        return d;
      });
      return pv;
    }, {}));

  return _vaccineDataRequest;
}
