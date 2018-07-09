import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState } from 'redux-persist';
import reducer from '~/reducers';
import initialState, { whitelist, blacklist } from './initialState';
import _ from 'lodash';

const composeEnhancers = composeWithDevTools({});

function getStorage(context) {
  if (context.cookieJar) {
    const { CookieStorage } = require('redux-persist-cookie-storage');
    return new CookieStorage(context.cookieJar, {});
  }
  return require('redux-persist/lib/storage').default;
}

async function getInitialState(context, persistConfig) {
  if (context.cookieJar) {
    let preloadedState = initialState;
    try {
      preloadedState = await getStoredState(persistConfig);
    } catch (err) {}
    return preloadedState;
  }
  return initialState;
}

function getPersistConfig(context) {
  const persistConfig = {
    key: 'root',
    storage: getStorage(context),
    stateReconciler: autoMergeLevel1
  };
  if (whitelist && whitelist.length) {
    persistConfig.whitelist = whitelist;
  } else if (blacklist && blacklist.length) {
    persistConfig.blacklist = blacklist;
  }
  return persistConfig;
}

export default function create(context) {
  const persistConfig = getPersistConfig(context);
  return createStore(
    persistReducer(persistConfig, reducer),
    initialState,
    composeEnhancers(applyMiddleware(reduxThunk))
  );
}

export async function createWebStore(context) {
  const persistConfig = getPersistConfig(context);
  return createStore(
    persistReducer(persistConfig, reducer),
    await getInitialState(context, persistConfig),
    composeEnhancers(applyMiddleware(reduxThunk))
  );
}
