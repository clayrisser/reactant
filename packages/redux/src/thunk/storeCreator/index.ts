import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getOptions, PluginOptions } from '@reactant/plugin';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import {
  Middleware,
  Reducer,
  Store,
  applyMiddleware,
  combineReducers,
  createStore as reduxCreateStore
} from 'redux';
// @ts-ignore
import reducers from '~/reducers';
import storage from './storage';
import { Reducers } from '../../types';

export default class StoreCreator {
  defaultState: object;

  middlewares: Middleware[];

  options: PluginOptions;

  persist: any = true;

  persistor?: Persistor;

  store: Store;

  reducers: Reducers;

  constructor(
    options: PluginOptions = {},
    customReducers: Reducers = {},
    defaultState = {},
    middlewares: Middleware[] = []
  ) {
    this.options = { ...getOptions('redux'), ...options };
    this.reducers = { ...reducers, ...customReducers };
    this.middlewares = [reduxThunk, ...middlewares];
    this.defaultState = {
      ...(this.options.defaultState || {}),
      ...defaultState
    };
    const whitelist = [...new Set(this.options.whitelist || [])];
    const blacklist = [...new Set(this.options.blacklist || [])];
    const filterRedux = whitelist.length ? 'whitelist' : 'blacklist';
    this.persist = {
      key: 'root',
      stateReconciler: autoMergeLevel1,
      storage,
      [filterRedux]: filterRedux === 'whitelist' ? whitelist : blacklist
    };
    if (this.options.persist === 'local') {
      this.persist.storage = storage;
    } else if (this.options.persist === false) {
      this.persist = false;
    } else if (typeof this.options.persist === 'object') {
      const persistOptions = { ...(this.options.persist || {}) };
      if (persistOptions.storage === 'default') {
        delete persistOptions.storage;
      } else if (persistOptions.storage === 'local') {
        delete persistOptions.storage;
        this.persist.storage = storage;
      }
      if (Number(persistOptions?.mergeLevel) === 1) {
        delete persistOptions.mergeLevel;
        this.persist.stateReconciler = autoMergeLevel1;
      } else if (Number(persistOptions?.mergeLevel) === 2) {
        delete persistOptions.mergeLevel;
        this.persist.stateReconciler = autoMergeLevel2;
      }
      this.persist = { ...this.persist, ...persistOptions };
    }
    const reducer: Reducer = this.persist
      ? persistReducer(this.persist, combineReducers(this.reducers))
      : combineReducers(this.reducers);
    const composeEnhancers = this.options.devTools
      ? composeWithDevTools(
          typeof this.options.devTools === 'object' ? this.options.devTools : {}
        )
      : null;
    this.store = reduxCreateStore(
      reducer,
      this.defaultState,
      composeEnhancers
        ? composeEnhancers(
            // @ts-ignore
            applyMiddleware(...this.middlewares)
          )
        : applyMiddleware(...this.middlewares)
    );
    if (this.persist) this.persistor = persistStore(this.store);
  }
}
