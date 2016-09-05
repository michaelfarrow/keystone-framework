
require('app.pcss');

import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer><App/></AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <AppContainer component={require('./App').default} />,
      rootEl
    );
  });
}
