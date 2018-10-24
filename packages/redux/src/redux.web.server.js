import Cookies from 'cookies';
import React, { Component } from 'react';
import _ from 'lodash';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import reducers from '~/reducers';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { config } from '@reactant/core';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState, persistStore } from 'redux-persist';
import {
  CookieStorage,
  NodeCookiesWrapper
} from 'redux-persist-cookie-storage';

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
        storage: null
      },
      whitelist = []
    }
  ) {
    this.ChildRoot = ChildRoot;
    this.blacklist = _.uniq([...blacklist, ...config.blacklist]);
    this.devTools = devTools;
    this.persist = persist;
    this.whitelist = _.uniq([...whitelist, ...config.whitelist]);
    this.initialState = {
      ...initialState,
      ...config.initialState
    };
  }

  get middleware() {
    const composeEnhancers = composeWithDevTools(this.devTools);
    return composeEnhancers(applyMiddleware(reduxThunk));
  }

  get reducer() {
    return persistReducer(this.persist, reducers);
  }

  willInit(app) {
    const expressApp = app.app;
    expressApp.use(Cookies.express());
    this.initialized = true;
    return app;
  }

  async willRender(app, { req, res }) {
    if (this.initialized) {
      this.cookieJar = new NodeCookiesWrapper(new Cookies(req, res));
      app.props = {
        ...app.props,
        context: {
          ...app.props.context,
          cookieJar: this.cookieJar
        }
      };
      this.props = app.props;
      if (!this.persist.storage) {
        this.persist.storage = new CookieStorage(this.cookieJar, {});
      }
      const store = await this.getStore();
      this.props = { ...this.props, store };
      this.persistor = await new Promise(resolve => {
        const persistor = persistStore(store, config.initialState, () => {
          return resolve(persistor);
        });
      });
    }
    return app;
  }

  async didRender(app, { res }) {
    if (this.initialized) {
      await this.persistor.flush();
      res.removeHeader('Set-Cookie');
    }
    return app;
  }

  async getInitialState() {
    const { cookieJar } = this;
    if (cookieJar) {
      try {
        const state = await getStoredState(this.persist);
        if (state) return state;
      } catch (err) {
        return this.initialState;
      }
    }
    return this.initialState;
  }

  async getStore() {
    return createStore(
      this.reducer,
      await this.getInitialState(),
      this.middleware
    );
  }

  async getRoot() {
    const { ChildRoot, initialized, props } = this;
    if (!initialized) return ChildRoot;
    return class Root extends Component {
      render() {
        return (
          <Provider store={props.store}>
            <ChildRoot {...props} />
          </Provider>
        );
      }
    };
  }
}
