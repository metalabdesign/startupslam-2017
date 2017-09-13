// Load up some polyfills for older browsers.
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './component/App';

const app = <App/>;
const element = document.getElementById('app');

ReactDOM.render(app, element);
