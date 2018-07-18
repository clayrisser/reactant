import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState } from 'redux-persist';
import reducer from '../../src/reducers';
import { config } from '.';

const composeEnhancers = composeWithDevTools({});

function getStorage(context) {
  if (context.cookieJar) {
    const { CookieStorage } = require('redux-persist-cookie-storage');
    return new CookieStorage(context.cookieJar, {});
  }
  return require('redux-persist/lib/storage').default;
}

async function getInitialState({ cookieJar }, persistConfig) {
  const { initialState } = config;
  if (cookieJar) {
    try {
      const state = await getStoredState(persistConfig);
      if (state) return state;
    } catch (err) {
      return initialState;
    }
  }
  return initialState;
}

function getPersistConfig(context) {
  const { whitelist, blacklist } = config;
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
  const { initialState } = config;
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
