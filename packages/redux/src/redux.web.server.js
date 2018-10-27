import Cookies from 'cookies';
import React, { Component } from 'react';
import _ from 'lodash';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import reducers from '~/reducers';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { callLifecycle } from '@reactant/core/plugin';
import { composeWithDevTools } from 'redux-devtools-extension';
import { config, log } from '@reactant/core';
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

  willInit(app) {
    const expressApp = app.app;
    expressApp.use(Cookies.express());
    this.initialized = true;
    return app;
  }

  async willRender(app, { req, res }) {
    this.app = app;
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
    req.redux = { persist };
    req.redux.initialState = await this.getInitialState({ req, res });
    req.redux.middleware = await this.getMiddleware({ req, res });
    req.redux.reducer = await this.getReducer({ req, res });
    const store = await this.getStore({ req, res });
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
    if (req.reactant) {
      const state = req.props.context.store.getState();
      log.silly('state', state);
      req.reactant = {
        ...req.reactant,
        context: {
          ...req.reactant.context,
          cookieJar: {},
          store: { state }
        }
      };
    }
    return app;
  }

  async getRoot(app, { req }) {
    const { ChildRoot, initialized } = this;
    if (!initialized) return ChildRoot;
    const { props } = req;
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

  async getReducer({ req, res }) {
    const { app } = this;
    const redux = {
      reducer: reducers
    };
    await callLifecycle('reduxApplyReducer', app, { req, res, redux });
    return persistReducer(req.redux.persist, redux.reducer);
  }

  async getMiddleware({ req, res }) {
    const { app, devTools } = this;
    const redux = {
      middleware: [reduxThunk]
    };
    const composeEnhancers = composeWithDevTools(devTools);
    await callLifecycle('reduxApplyMiddleware', app, { req, res, redux });
    return composeEnhancers(applyMiddleware(...redux.middleware));
  }

  async getInitialState({ req, res }) {
    const { app, initialState } = this;
    const { props } = req;
    const redux = {
      initialState
    };
    await callLifecycle('reduxApplyInitialState', app, { req, res, redux });
    if (props.context.cookieJar) {
      try {
        const state = await getStoredState(req.redux.persist);
        if (state) return state;
      } catch (err) {
        return initialState;
      }
    }
    return initialState;
  }

  async getStore({ req }) {
    const { redux } = req;
    return createStore(redux.reducer, redux.initialState, redux.middleware);
  }
}
