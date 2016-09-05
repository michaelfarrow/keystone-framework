
require('app.pcss');

import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';

const rootEl = document.querySelector('.subtitle');
ReactDOM.render(
  <AppContainer><MyComponent/></AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./MyComponent', () => {
    ReactDOM.render(
      <AppContainer component={require('./MyComponent').default} />,
      rootEl
    );
  });
}
