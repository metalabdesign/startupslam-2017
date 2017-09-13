export const sampleIndex = {
  mappings: {
    pageview: {
      properties: {
        '@timestamp': {type: 'date'},
        os: {type: 'keyword'},
        browser: {type: 'keyword'},
        gender: {type: 'keyword'},
        age: {type: 'double'},
      },
    },
  },
};

export const fetchSampleData = () => fetch([
  'https://gist.githubusercontent.com',
  '/izaakschroeder',
  '/224a7d6feac9eddac9a13356fa492bb7',
  '/raw',
  '/ccea02fd6f380745a271a683cd4e43698546efe1',
  '/startup-slam-2017-sample-data.njson',
].join('')).then((res) => {
  if (!res.ok) {
    return Promise.reject();
  }
  return res.text();
});
