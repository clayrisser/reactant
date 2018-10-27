import React, { Component } from 'react';
import _ from 'lodash';
import { StaticRouter } from 'react-router';
import { config } from '@reactant/core';
import { createMemoryHistory } from 'history';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';

const history = createMemoryHistory();

export default class ReactRouter {
  name = 'react-router';

  initialized = false;

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

  willInit() {
    this.initialized = true;
  }

  reduxApplyReducer(app, { redux }) {
    redux.reducer = connectRouter(history)(redux.reducer);
    return app;
  }

  reduxApplyMiddleware(app, { redux }) {
    redux.middleware.push(routerMiddleware(history));
    return app;
  }

  getRoot(app, { req }) {
    const { ChildRoot, bindRedux, initialized } = this;
    const { props } = req;
    if (!initialized) return ChildRoot;
    return class ReactRouterPlugin extends Component {
      render() {
        if (bindRedux) {
          return (
            <StaticRouter
              location={props.context.location}
              context={props.context}
            >
              <ConnectedRouter history={history} store={props.context.store}>
                <ChildRoot {...props} />
              </ConnectedRouter>
            </StaticRouter>
          );
        }
        return (
          <StaticRouter
            location={props.context.location}
            context={props.context}
          >
            <ChildRoot {...props} />
          </StaticRouter>
        );
      }
    };
  }
}
