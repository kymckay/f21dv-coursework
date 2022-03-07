let _covidDataRequest;

/**
 * Lazy loader for COVID-19 data
 * @returns Promise for global COVID-19 data
 */
export async function covidData() {
  if (_covidDataRequest) return await _covidDataRequest;
  _covidDataRequest = d3.json('owid-covid-data.json');
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

  // Once fetched, want data to be accessible by ISO code keys
  _vaccineDataRequest = d3.json('vaccinations.json')
    .then(data => data.reduce((pv, cv) => {
      pv[cv.iso_code] = cv.data;
      return pv;
    }, {}));

  return _vaccineDataRequest;
}
