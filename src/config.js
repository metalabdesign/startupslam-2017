import {hri} from 'human-readable-ids';

/**
 * Generate a consistently unique index name. This is useful to prevent people
 * from accidentally using other people's indices. The result is saved to local
 * storage so that when the page is refreshed the result is the same.
 * @returns {String} Unique index name.
 */
const getUniqueIndex = () => {
  if (localStorage.getItem('slam-index')) {
    return localStorage.getItem('slam-index');
  }
  const index = hri.random();
  localStorage.setItem('slam-index', index);
  return index;
};

// Pick a unique index name for yourself. This is especially
// important if you're using a shared ElasticSearch instance.
// The default picks you a random one.
const index = getUniqueIndex();

/**
 * If you have ElasticSearch setup elsewhere you can change this URL to point to
 * your own instance. For example: const base = `http://localhost:9200/${index}`
 */
export const base = [
  'https://',
  'search-startupslam-4zqyzoae7nleoc6wbdiscros34.',
  'us-west-2.es.amazonaws.com',
  `/${index}`,
].join('');

/**
 * If you have Kibana setup elsewhere you can change this URL to point to your
 * own instance. For example: const kibanaUrl = `http://localhost:5601/`
 */
export const kibanaUrl = [
  'https://',
  'search-startupslam-4zqyzoae7nleoc6wbdiscros34.',
  'us-west-2.es.amazonaws.com',
  '/_plugin/kibana',
].join('');

/**
 * These are the index settings used when creating the index. They current just
 * have mappings for pageview events which correspond to the tutorial.
 */
export const indexSettings = {
  mappings: {
    // Add event types here. We're currently only defining
    // one called "pageview" but you can setup as many as
    // you would like.
    pageview: {
      properties: {
        // Add event properties here.
        // Every event should have a time field and it's
        // traditionally denoated as `@timestamp` though
        // this is convention and not requirement.
        '@timestamp': {type: 'date'},
        // The rest of the fields here are up to you.
        os: {type: 'keyword'},
        browser: {type: 'keyword'},
        gender: {type: 'keyword'},
        age: {type: 'double'},
      },
    },
  },
};
