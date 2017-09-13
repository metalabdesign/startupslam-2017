import {handleResponse} from './util';

/**
 * Send an analytics event to ElasticSearch. Normally parts of this would be
 * implemented on your server somewhere instead of calling directly to
 * ElasticSearch, but for now you can just take this as-is to send  analytics
 * events out.
 * @param {String} base URL to index to add event to.
 * @param {String} type Type of event. This corresponds to whatever mappings you
 * setup previously.
 * @param {Object} payload Data for the event. The fields in this correspond to
 * the properties of the mapping.
 * @returns {Promise} Result of operation.
 */
export const sendEvent = (base, type, payload) => {
  const body = JSON.stringify(Object.assign({
    '@timestamp': Date.now(),
  }, payload));
  return fetch(`${base}/${type}`, {
    body,
    method: 'POST',
  }).then(handleResponse);
};
