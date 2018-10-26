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

  reduxApplyReducer(app, { reducer }) {
    _.assign(reducer, connectRouter(history)(reducer));
    return app;
  }

  reduxApplyMiddleware(app, { middleware }) {
    middleware.push(routerMiddleware(history));
    return app;
  }

  get Root() {
    const { ChildRoot, bindRedux } = this;
    return class Root extends Component {
      render() {
        if (bindRedux) {
          return (
            <BrowserRouter>
              <ConnectedRouter history={history}>
                <ChildRoot {...this.props} />
              </ConnectedRouter>
            </BrowserRouter>
          );
        }
        return (
          <BrowserRouter>
            <ChildRoot {...this.props} />
          </BrowserRouter>
        );
      }
    };
  }
}
