import React, { Component } from 'react';
import _ from 'lodash';
import reducers from '~/reducers';
import reduxThunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { config } from '@reactant/core';
import { createStore, applyMiddleware } from 'redux';
import { persistReducer, getStoredState } from 'redux-persist';

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
        storage
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
    const { ChildRoot } = this;
    const store = await this.getStore();
    this.props = { ...this.props, store };
    return class Root extends Component {
      render() {
        return (
          <Provider store={store}>
            <ChildRoot {...this.props} />
          </Provider>
        );
      }
    };
  }
}
