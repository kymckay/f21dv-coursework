let _covidDataRequest;

/**
 * Lazy loader for COVID-19 data
 * @returns Promise for global COVID-19 data
 */
export async function covidData() {
  if (_covidDataRequest) return await _covidDataRequest;

  // Reduce CSV rows into object accessible by ISO code
  _covidDataRequest = d3.csv('owid-covid-data.csv')
    .then(data => data.reduce((pv, cv) => {
      const { iso_code } = cv;

      if (!pv[iso_code]) {
        pv[iso_code] = {
          continent: cv.continent,
          location: cv.location,
          data: [],
        };
      }

      // CSV file values are all strings to be casted
      const record = {
        date: new Date(cv.date),
      }
      for (const column of covidData.extract) {
        record[column] = csvNumeric(cv, column);
      }

      pv[iso_code].data.push(record);

      return pv;
    }, {}));

  return _covidDataRequest;
}
covidData.summaryStats = [
  'gdp_per_capita',
  'population_density',
  'total_cases_per_million',
];
// Some attributes are monotonic, these are suitable to plot against
covidData.toPlotAgainst = [
  'date',
  'total_cases',
  'people_vaccinated',
  'people_fully_vaccinated',
  'total_deaths',
];
// Others are suitable to plot, but not against (removing date from this)
covidData.toPlot = covidData.toPlotAgainst.slice(1).concat([
  'new_cases',
  'new_cases_smoothed',
  'new_deaths',
  'new_deaths_smoothed',
  'icu_patients',
]);
covidData.extract = [].concat(
  covidData.summaryStats,
  covidData.toPlotAgainst.slice(1),
  covidData.toPlot
);

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

/**
 * Extracts a numeric column value from a row object.
 * Since absent data is intentional, don't want to convert to a 0 by
 * accident
 * @param {*} row row object with column headings as properties
 * @param {*} col column heading to extract
 * @returns
 */
function csvNumeric(row, col) {
  const { [col]: val } = row;
  return val ? Number(val) : null;
}
