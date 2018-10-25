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
    this.blacklist = _.uniq([...blacklist, ...config.redux.blacklist]);
    this.devTools = devTools;
    this.persist = persist;
    this.whitelist = _.uniq([...whitelist, ...config.redux.whitelist]);
    this.initialState = {
      ...initialState,
      ...config.redux.initialState
    };
  }

  get middleware() {
    const composeEnhancers = composeWithDevTools(this.devTools);
    return composeEnhancers(applyMiddleware(reduxThunk));
  }

  willInit(app) {
    const expressApp = app.app;
    expressApp.use(Cookies.express());
    this.initialized = true;
    return app;
  }

  async willRender(app, { req, res }) {
    const cookieJar = new NodeCookiesWrapper(new Cookies(req, res));
    req.props = {
      ...req.props,
      context: {
        ...req.props.context,
        cookieJar
      }
    };
    const persist = {
      key: this.persist.key,
      stateReconciler: this.persist.stateReconciler,
      storage: this.persist.storage || new CookieStorage(cookieJar, {})
    };
    req.persist = persist;
    const store = await this.getStore({ req });
    req.props.context = { ...req.props.context, store };
    req.persistor = await new Promise(resolve => {
      const persistor = persistStore(store, config.initialState, () => {
        return resolve(persistor);
      });
    });
    return app;
  }

  async didRender(app, { req, res }) {
    if (this.initialized) {
      await req.persistor.flush();
      res.removeHeader('Set-Cookie');
    }
    return app;
  }

  async getRoot(app, { req }) {
    const { ChildRoot, initialized } = this;
    if (!initialized) return ChildRoot;
    const { props } = req;
    return class Root extends Component {
      render() {
        return (
          <Provider store={props.context.store}>
            <ChildRoot {...props} />
          </Provider>
        );
      }
    };
  }

  getReducer({ persist }) {
    return persistReducer(persist, reducers);
  }

  async getInitialState({ req }) {
    const { cookieJar } = req.props.context;
    if (cookieJar) {
      try {
        const state = await getStoredState(req.persist);
        if (state) return state;
      } catch (err) {
        return this.initialState;
      }
    }
    return this.initialState;
  }

  async getStore({ req }) {
    return createStore(
      this.getReducer({ persist: req.persist }),
      await this.getInitialState({ req }),
      this.middleware
    );
  }
}