import React from 'react';
import { render } from 'react-dom'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import App from './SampleApp';
import reducer from './FocusManager/reducer'

const store = createStore(
  reducer, 
  compose(
      applyMiddleware(
          thunk
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
