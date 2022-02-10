import React from 'react';
import ReduxThunk from 'redux-thunk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

import reducers from './reducers';
import Main from './components/Main/Main';

import '../styles/main.scss';
import { configureFakeBackend } from '../_helpers';

configureFakeBackend();

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
