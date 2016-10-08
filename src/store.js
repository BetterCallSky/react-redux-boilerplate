import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk];


  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger({ collapsed: true }));
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
    compose(
      applyMiddleware(...middleware),
    )
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const newReducers = require('./reducers').default;

      store.replaceReducer(newReducers(store.asyncReducers));
    });
  }

  return store;
};
