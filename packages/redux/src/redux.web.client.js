import Cookies from 'cookies-js';
import React, { Component } from 'react';
import _ from 'lodash';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducers from '~/reducers';
import reduxThunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { CookieStorage } from 'redux-persist-cookie-storage';
import { Provider } from 'react-redux';
import { callLifecycle } from '@reactant/core/plugin';
import { composeWithDevTools } from 'redux-devtools-extension';
import { config } from '@reactant/core';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState, persistStore } from 'redux-persist';

function getDefaultStorage() {
  const { platform, platforms } = config;
  if (platforms[platform] === '@reactant/web-isomorphic') return null;
  return storage;
}

export default class StyledComponents {
  name = 'redux';

  constructor(
    ChildRoot,
    {
      blacklist = [],
      devTools = {},
      initialState = {},
      persist = {
        key: 'root',
        stateReconciler: autoMergeLevel1,
        storage: getDefaultStorage()
      },
      whitelist = []
    }
  ) {
    whitelist = _.uniq([...whitelist, ...config.redux.whitelist]);
    blacklist = _.uniq([...blacklist, ...config.redux.blacklist]);
    this.ChildRoot = ChildRoot;
    this.devTools = devTools;
    const filterRedux = whitelist.length ? 'whitelist' : 'blacklist';
    this.persist = {
      ...persist,
      ...{
        [filterRedux]: filterRedux === 'whitelist' ? whitelist : blacklist
      }
    };
    if (!_.isNil(config.redux.persist)) {
      const configPersist = config.redux.persist;
      if (_.isPlainObject(configPersist)) {
        if (configPersist.storage === 'default') delete configPersist.storage;
        this.persist = { ...this.persist, ...configPersist };
        if (configPersist.storage === 'local') {
          this.persist = { ...this.persist, storage };
        }
        if (Number(configPersist.mergeLevel) === 1) {
          this.persist = { ...this.persist, stateReconciler: autoMergeLevel1 };
        } else if (Number(configPersist.mergeLevel) === 2) {
          this.persist = { ...this.persist, stateReconciler: autoMergeLevel2 };
        }
      } else if (configPersist === 'local') {
        this.persist = { ...this.persist, storage };
      } else if (configPersist === false) {
        this.persist = false;
      }
    }
    this.initialState = {
      ...initialState,
      ...config.redux.initialState
    };
  }

  async willRender(app) {
    this.app = app;
    const persist = this.persist ? { ...this.persist } : false;
    const cookieJar = persist && persist.storage ? null : Cookies;
    if (persist && !persist.storage) {
      persist.storage = new CookieStorage(cookieJar, {});
    }
    app.props = {
      ...app.props,
      context: {
        ...app.props.context,
        ...(cookieJar ? { cookieJar } : {})
      }
    };
    app.redux = { persist };
    app.redux.initialState = await this.getInitialState();
    app.redux.middleware = await this.getMiddleware();
    app.redux.reducer = await this.getReducer();
    const store = await this.getStore();
    app.props.context = { ...app.props.context, store };
    if (persist) {
      app.redux.persistor = await new Promise(resolve => {
        const persistor = persistStore(store, app.redux.initialState, () => {
          return resolve(persistor);
        });
      });
    }
    return app;
  }

  async getRoot(app) {
    const { ChildRoot } = this;
    const { props } = app;
    return class ReduxPlugin extends Component {
      render() {
        return (
          <Provider store={props.context.store}>
            <ChildRoot {...props} />
          </Provider>
        );
      }
    };
  }

  async getReducer() {
    const { app } = this;
    const redux = {
      reducer: reducers
    };
    await callLifecycle('reduxApplyReducer', app, { redux });
    if (!app.redux.persist) return redux.reducer;
    return persistReducer(app.redux.persist, redux.reducer);
  }

  async getMiddleware() {
    const { app, devTools } = this;
    const redux = {
      middleware: [reduxThunk]
    };
    const composeEnhancers = composeWithDevTools(devTools);
    await callLifecycle('reduxApplyMiddleware', app, { redux });
    return composeEnhancers(applyMiddleware(...redux.middleware));
  }

  async getInitialState() {
    const { app, initialState } = this;
    const redux = {
      initialState
    };
    await callLifecycle('reduxApplyInitialState', app, { redux });
    if (app.redux.persist) {
      try {
        const state = await getStoredState(app.redux.persist);
        if (state) return state;
      } catch (err) {
        return redux.initialState;
      }
    }
    return redux.initialState;
  }

  async getStore() {
    const { redux } = this.app;
    return createStore(redux.reducer, redux.initialState, redux.middleware);
  }
}
