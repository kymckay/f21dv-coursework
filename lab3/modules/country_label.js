import { covidData } from "./fetchers.js";
import { addModelListener } from "./model.js";

export function makeCountryLabel(element_id, countryProp) {
  const container = d3.select(`#${element_id}`)
    .append('div')
      .classed('map-labels', true);

  const label = container.append('p');

  addModelListener(countryProp, async iso_code => {
    const country = (await covidData())[iso_code];
    label.text(country ? country.location : '');
  });
}
