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
      let {
        date,
        people_fully_vaccinated,
        people_vaccinated,
        total_cases_per_million,
        total_cases,
        total_deaths,
      } = cv;

      // CSV file values are all read as strings
      date = new Date(date);
      // Value filling absent data is undesired, it is intentional
      // where unmeasured or irrelevent (e.g. boosters start later)
      people_fully_vaccinated = people_fully_vaccinated ? Number(people_fully_vaccinated) : null;
      people_vaccinated = people_vaccinated ? Number(people_vaccinated) : null;
      total_cases = total_cases ? Number(total_cases) : null;
      total_deaths = total_deaths ? Number(total_deaths) : null;
      total_cases_per_million = total_cases_per_million ? Number(total_cases_per_million) : null;

      if (!pv[iso_code]) {
        pv[iso_code] = {
          continent: cv.continent,
          location: cv.location,
          data: [],
        };
      }

      pv[iso_code].data.push({
        date,
        people_fully_vaccinated,
        people_vaccinated,
        total_cases_per_million,
        total_cases,
        total_deaths,
      });

      return pv;
    }, {}));

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
