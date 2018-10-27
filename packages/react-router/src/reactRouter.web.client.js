import React, { Component } from 'react';
import _ from 'lodash';
import { BrowserRouter } from 'react-router-dom';
import { config } from '@reactant/core';
import { createBrowserHistory } from 'history';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';

const history = createBrowserHistory();

export default class ReactRouter {
  name = 'react-router';

  constructor(
    ChildRoot,
    { bindRedux = _.includes(config.plugins, '@reactant/redux') }
  ) {
    this.ChildRoot = ChildRoot;
    this.bindRedux =
      config.reactRouter.bindRedux !== null
        ? config.reactRouter.bindRedux
        : bindRedux;
  }

  reduxApplyReducer(app, { redux }) {
    redux.reducer = connectRouter(history)(redux.reducer);
    return app;
  }

  reduxApplyMiddleware(app, { redux }) {
    redux.middleware.push(routerMiddleware(history));
    return app;
  }

  getRoot(app) {
    const { ChildRoot, bindRedux } = this;
    const { props } = app;
    return class ReactRouterPlugin extends Component {
      render() {
        if (bindRedux) {
          return (
            <BrowserRouter>
              <ConnectedRouter history={history} store={props.context.store}>
                <ChildRoot {...props} />
              </ConnectedRouter>
            </BrowserRouter>
          );
        }
        return (
          <BrowserRouter>
            <ChildRoot {...props} />
          </BrowserRouter>
        );
      }
    };
  }
}
