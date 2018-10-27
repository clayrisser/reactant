import Cookies from 'cookies';
import React, { Component } from 'react';
import _ from 'lodash';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
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
  name = '@reactant/redux';

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
          this.persist = false;
        } else if (Number(configPersist.mergeLevel) === 1) {
          this.persist = { ...this.persist, stateReconciler: autoMergeLevel1 };
        } else if (Number(configPersist.mergeLevel) === 2) {
          this.persist = { ...this.persist, stateReconciler: autoMergeLevel2 };
        }
      } else if (configPersist === 'local') {
        this.persist = false;
      } else if (configPersist === false) {
        this.persist = false;
      }
    }
    this.initialState = {
      ...initialState,
      ...config.redux.initialState
    };
  }

  willInit(app) {
    const expressApp = app.app;
    expressApp.use(Cookies.express());
    return app;
  }

  async willRender(app, { req, res }) {
    this.app = app;
    const persist = this.persist ? { ...this.persist } : false;
    const cookieJar =
      persist && persist.storage
        ? null
        : new NodeCookiesWrapper(new Cookies(req, res));
    if (persist && !persist.storage) {
      persist.storage = new CookieStorage(cookieJar, {});
    }
    req.props = {
      ...req.props,
      context: {
        ...req.props.context,
        ...(cookieJar ? { cookieJar } : {})
      }
    };
    req.redux = { persist };
    req.redux.initialState = await this.getInitialState({ req, res });
    req.redux.middleware = await this.getMiddleware({ req, res });
    req.redux.reducer = await this.getReducer({ req, res });
    const store = await this.getStore({ req, res });
    req.props.context = { ...req.props.context, store };
    if (persist) {
      req.redux.persistor = await new Promise(resolve => {
        const persistor = persistStore(store, req.redux.initialState, () => {
          return resolve(persistor);
        });
      });
    }
    return app;
  }

  async didRender(app, { req, res }) {
    if (req.redux.persist) {
      await req.redux.persistor.flush();
      res.removeHeader('Set-Cookie');
    }
    if (req.reactant) {
      const state = req.props.context.store.getState();
      log.silly('state', state);
      req.reactant = {
        ...req.reactant,
        context: {
          ...req.reactant.context,
          ...(req.reactant.context.cookieJar ? { cookieJar: {} } : {}),
          store: { state }
        }
      };
    }
    return app;
  }

  async getRoot(app, { req }) {
    const { ChildRoot } = this;
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
    if (!req.redux.persist) return redux.reducer;
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
    const redux = {
      initialState
    };
    await callLifecycle('reduxApplyInitialState', app, { req, res, redux });
    if (req.redux.persist) {
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
