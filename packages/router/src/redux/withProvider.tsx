import React, { Component, FC } from 'react';
import {
  Provider,
  ProviderProps,
  Reducer,
  StoreContext
} from '@reactant/redux';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import history from '../history';

export interface UnknownProps {
  [key: string]: any;
}

export default function withProvider(
  ReduxProvider: Provider,
  storeContext: StoreContext,
  providerProps?: ProviderProps
): (App: FC | typeof Component) => FC {
  return (App: FC | typeof Component) => {
    return (props: UnknownProps) => (
      <ReduxProvider
        reducers={{ router: connectRouter(history) as Reducer }}
        middlewares={[routerMiddleware(history)]}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...providerProps}
      >
        <ConnectedRouter history={history} context={storeContext}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <App {...props} />
        </ConnectedRouter>
      </ReduxProvider>
    );
  };
}

export * from 'connected-react-router';
