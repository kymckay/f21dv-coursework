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
  brushedBounds: null,
  bounds: null,
  mapColors: null,
  brushedCountries: null,
};
const listeners = [];

/**
 * Push an update to the data model.
 * @param {object} changes object with new values for attributes
 */
export function updateModel(changes) {
  const delta = {};

  for (const key in changes) {
    // Only keys existing in the model can be updated
    if (key in model) {
      // Will only dispatch changed values to listeners
      if (model[key] != changes[key]) {
        model[key] = changes[key];
        delta[key] = changes[key];
      }
    } else {
      throw `Bad model update atempted with key: ${key}`;
    }
  }

  for (const listener of listeners) {
    listener(delta);
  }
}

/**
 * Register an event listener to run on updates to the data model.
 * @param {function(string)} listener callback to run with new attribute value
 */
export function addModelListener(listener) {
  listeners.push(listener);
  listener(model);
}
