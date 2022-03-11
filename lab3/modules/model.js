/**
 * This module is an encapsulation of the dashboard data model.
 *
 * The view can register callbacks as event listeners to handle context
 * changes on user interaction.
 */
const model = {
  // Initially the world is selected
  selectedCountry: 'OWID_WRL',
  hoveredCountry: null,
  axisValue: 'date',
  brushedValue: null,
  mapColors: null,
}
const listeners = {
  selectedCountry: [],
  hoveredCountry: [],
  axisValue: [],
  brushedValue: [],
  mapColors: [],
}

export const axisTypes = ['date', 'total_cases', 'people_vaccinated', 'people_fully_vaccinated'];

/**
 * Push a new value to a data model attribute.
 * @param {string} key attribute to update
 * @param {*} value new value of attribute
 * @returns
 */
export function updateModel(key, value) {
  if (model[key] === value) return;

  model[key] = value;

  for (const listener of listeners[key]) {
    listener(model);
  }
}

/**
 * Register an event listener for a certain attribute of the data model.
 * @param {string} key attribute to listen for changes to
 * @param {function(string)} listener callback to run with new attribute value
 */
export function addModelListener(key, listener) {
  listeners[key].push(listener);
  listener(model);
}
