import UAParser from 'ua-parser-js';

/**
 * Handle response from JSON-based API via `fetch`.
 * Basically just rejects promises that fail an
 * HTTP status code check and parses JSON bodies.
 * @param {Response} res Fetch response.
 * @returns {Promise} JSON parsed result of fetch.
 */
export const handleResponse = (res) => {
  const body = res.json();
  if (res.ok) {
    return body;
  }
  return body.then((x) => Promise.reject(x));
};

/**
 * Get the index name from an ElasticSearch URL.
 * @param {String} base The base ElasticSearch URL.
 * @returns {?String} The index name.
 */
export const getIndex = (base) => {
  const result = /\/\/[^\/]+\/([^\/]+)/.exec(base);
  return result ? result[1] : null;
};

/**
 * Get the current location of the user using the browser's location services.
 * @returns {Promise} Location promise.
 */
export const getLocation = () => new Promise((resolve, reject) => {
  try {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  } catch (error) {
    reject(error);
  }
});

/**
 * Get browser and OS information.
 * @returns {Object} Browser and OS information.
 */
export const getEnvironmentData = () => {
  try {
    const ua = new UAParser(navigator.userAgent);
    return {
      os: ua.getOS().name,
      browser: ua.getBrowser().name,
    };
  } catch (_err) {
    //
    return {};
  }
};
