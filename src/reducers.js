import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as form } from 'redux-form';

export const makeRootReducer = (asyncReducers) => combineReducers({
  router,
  form,
  reduxAsyncConnect,
  ...asyncReducers,
});

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer; // eslint-disable-line no-param-reassign
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
