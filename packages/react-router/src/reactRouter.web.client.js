import React, { Component } from 'react';
import _ from 'lodash';
import { BrowserRouter } from 'react-router-dom';
import { config } from '@reactant/core';
import { createBrowserHistory } from 'history';
import { onRouteLoaded } from 'react-router-defer';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import './replaceWithPolyfill';

export default class ReactRouter {
  name = '@reactant/react-router';

  constructor(
    ChildRoot,
    { bindRedux = _.includes(config.plugins, '@reactant/redux') }
  ) {
    this.ChildRoot = ChildRoot;
    this.bindRedux =
      config?.reactRouter?.bindRedux !== null
        ? config.reactRouter.bindRedux
        : bindRedux;
    let loaded = false;
    const routeLoadedHandle = onRouteLoaded(() => {
      if (!loaded) {
        loaded = true;
        this.handleLoaded();
        routeLoadedHandle.remove();
      }
    });
  }

  reduxApplyReducer(app, { redux }) {
    const { bindRedux } = this;
    const { props } = app;
    if (bindRedux) {
      redux.reducer = connectRouter(props.context.history)(redux.reducer);
    }
    return app;
  }

  reduxApplyMiddleware(app, { redux }) {
    const { bindRedux } = this;
    const { props } = app;
    if (bindRedux) {
      redux.middleware.push(routerMiddleware(props.context.history));
    }
    return app;
  }

  willRender(app) {
    this.app = app;
    const { props } = app;
    props.context = {
      ...(props.context || {}),
      history: createBrowserHistory()
    };
    app.container = document.createElement('div');
  }

  handleLoaded() {
    const appElement = document.getElementById('app');
    const { container } = this.app;
    container.id = 'app';
    appElement.replaceWith(container);
  }

  getRoot(app) {
    const { ChildRoot, bindRedux } = this;
    const { props } = app;
    return class ReactRouterPlugin extends Component {
      render() {
        if (bindRedux) {
          return (
            <BrowserRouter>
              <ConnectedRouter history={props.context.history}>
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
