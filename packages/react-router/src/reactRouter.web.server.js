import React, { Component } from 'react';
import _ from 'lodash';
import { StaticRouter } from 'react-router-defer';
import { config } from '@reactant/core';
import { createMemoryHistory } from 'history';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';

export default class ReactRouter {
  name = '@reactant/react-router';

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

  willRender(app, { req }) {
    const { props } = req;
    props.context = {
      ...(props.context || {}),
      history: createMemoryHistory()
    };
  }

  reduxApplyReducer(app, { req, redux }) {
    const { props } = req;
    redux.reducer = connectRouter(props.context.history)(redux.reducer);
    return app;
  }

  reduxApplyMiddleware(app, { req, redux }) {
    const { props } = req;
    redux.middleware.push(routerMiddleware(props.context.history));
    return app;
  }

  getRoot(app, { req }) {
    const { ChildRoot, bindRedux } = this;
    const { props } = req;
    return class ReactRouterPlugin extends Component {
      render() {
        if (bindRedux) {
          return (
            <StaticRouter
              location={props.context.location}
              context={props.context}
            >
              <ConnectedRouter
                history={props.context.history}
                location={props.context.location}
                store={props.context.store}
              >
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
