let _covidDataRequest;

/**
 * Lazy loader for COVID-19 data
 * @returns Global COVID-19 data
 */
export async function covidData() {
  if (_covidDataRequest) return await _covidDataRequest;
  _covidDataRequest = d3.json('https://covid.ourworldindata.org/data/owid-covid-data.json');
  return await _covidDataRequest;
}
