const gaussian = function() {
  let rand = 0;
  for (let i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
};

const gaussianRange = function(start, end) {
  return Math.floor(start + gaussian() * (end - start + 1));
};

const rand = function(min, max) {
  return Math.random() * (max - min) + min;
};

const draw = function(list, weight) {
  const totalWeight = weight.reduce(function(prev, cur) {
    return prev + cur;
  });
  const r = rand(0, totalWeight);
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += weight[i];
    sum = +sum.toFixed(2);
    if (r <= sum) {
      return list[i];
    }
  }
  throw new Error();
};

const os = [
  'android',
  'ios',
  'mac',
  'windows',
  'linux',
];

const browser = [
  'chrome',
  'firefox',
  'safari',
  'ie',
  'other',
];

const gender = ['male', 'female', 'other'];

const drawBrowser = function(os) {
  switch (os) {
  case 'mac':
    return draw(browser, [0.3, 0.1, 0.5, 0, 0.01]);
  case 'ios':
    return draw(browser, [0.1, 0.01, 0.8, 0, 0]);
  case 'android':
    return draw(browser, [1, 0, 0, 0, 0]);
  case 'windows':
    return draw(browser, [0.2, 0.1, 0, 0.2, 0.01]);
  case 'linux':
    return draw(browser, [0.2, 0.6, 0, 0, 0.1]);
  default:
    throw new TypeError();
  }
};

const users = [];

for (let i = 0; i < 1000; ++i) {
  const osResult = draw(os, [0.1, 0.2, 0.4, 0.3, 0.2]);
  const genderResult = draw(gender, [0.5, 0.4, 0.05]);
  users.push({
    os: osResult,
    browser: drawBrowser(osResult),
    gender: genderResult,
    age: gaussianRange(14, 45),
  });
}

const result = [];
const base = Math.floor(Date.now() / 8.64e+7) * 8.64e+7;
for (let day = -7; day < 0; ++day) {
  for (let i = 0; i < gaussianRange(45, 350); ++i) {
    result.push(
      JSON.stringify({index: {_type: 'pageview'}}),
      JSON.stringify(Object.assign({
        '@timestamp': base + (day * 8.64e+7) + gaussianRange(0, 8.64e+7),
      }, users[gaussianRange(0, users.length)]))
    );
  }
}

/* eslint-disable no-console */
console.log(result.join('\n'));
