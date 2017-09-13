import {handleResponse} from './util';

/**
 * Setup the index. Call if you have not yet made your index or you have
 * previously deleted yours and want to remake it with different mappings.
 * @param {String} base URL to index to setup.
 * @param {Object} payload Index settings.
 * @returns {Promise} Result of operation.
 */
export const setupIndex = (base, payload) => {
  return fetch(base, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

/**
 * Delete the index. Use this if you've messed up and want to restart or you
 * need to change your mappings. Please be nice and don't delete other people's
 * stuff.
 * @param {String} base URL to index to delete.
 * @returns {Promise} Result of operation.
 */
export const removeIndex = (base) => {
  return fetch(base, {
    method: 'DELETE',
    accept: 'application/json',
  }).then(handleResponse);
};

/**
 * Bulk load data into ElasticSearch.
 * @param {String} base Index to load data into.
 * @param {String} payload Raw bulk entries.
 * @returns {Promise} Result of operation.
 */
export const bulk = (base, payload) => {
  return fetch(`${base}/_bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ndjson',
      Accept: 'application/json',
    },
    body: payload,
  }).then(handleResponse);
};

/**
 * Drop all data from an index without deleting the index or mapping info.
 * @param {String} base Index to delete data from.
 * @returns {Promise} Result of operation.
 */
export const purge = (base) => {
  return fetch(`${base}/_delete_by_query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: {match_all: {}}, // eslint-disable-line
    }),
  }).then(handleResponse);
};
