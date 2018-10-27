import Cookies from 'cookies-js';
import React, { Component } from 'react';
import _ from 'lodash';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import reducers from '~/reducers';
import reduxThunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { CookieStorage } from 'redux-persist-cookie-storage';
import { Provider } from 'react-redux';
import { callLifecycle } from '@reactant/core/plugin';
import { composeWithDevTools } from 'redux-devtools-extension';
import { config } from '@reactant/core';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState } from 'redux-persist';

function getDefaultStorage() {
  const { platform, platforms } = config;
  if (platforms[platform] === '@reactant/web-isomorphic') return null;
  return storage;
}

export default class StyledComponents {
  name = 'redux';

  initialized = false;

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
    this.ChildRoot = ChildRoot;
    this.blacklist = _.uniq([...blacklist, ...config.redux.blacklist]);
    this.devTools = devTools;
    this.persist = persist;
    this.whitelist = _.uniq([...whitelist, ...config.redux.whitelist]);
    this.initialState = {
      ...initialState,
      ...config.redux.initialState
    };
  }

  willInit() {
    this.initialized = true;
  }

  async willRender(app) {
    this.app = app;
    const cookieJar = Cookies;
    app.props = {
      ...app.props,
      context: {
        ...app.props.context,
        cookieJar
      }
    };
    const { persist } = this;
    if (!persist.storage) {
      persist.storage = new CookieStorage(cookieJar, {});
    }
    app.redux = { persist };
    app.redux.initialState = await this.getInitialState();
    app.redux.middleware = await this.getMiddleware();
    app.redux.reducer = await this.getReducer();
    const store = await this.getStore();
    app.props.context = {
      ...app.props.context,
      store
    };
    return app;
  }

  async getRoot(app) {
    const { ChildRoot, initialized } = this;
    const { props } = app;
    if (!initialized) return ChildRoot;
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
    const { props } = app;
    const redux = {
      initialState
    };
    await callLifecycle('reduxApplyInitialState', app, { redux });
    if (props.context.cookieJar) {
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
