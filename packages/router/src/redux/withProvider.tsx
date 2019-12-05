import React, { Component, FC } from 'react';
import { Provider, ProviderProps, StoreContext } from '@reactant/redux';
import { Reducer } from 'redux';
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
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...providerProps}
        reducers={{
          router: connectRouter(history) as Reducer,
          ...(providerProps?.reducers || {})
        }}
        middlewares={[
          ...(providerProps?.middlewares || []),
          routerMiddleware(history)
        ]}
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
