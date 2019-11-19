import React, { FC, ReactNode } from 'react';
import { Provider, Reducer } from '@reactant/redux';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import history from './history';

export interface ProviderProps {
  children?: ReactNode;
}

export default function connectProvider(
  ReduxProvider: Provider
): FC<ProviderProps> {
  return (props: ProviderProps) => {
    return (
      <ReduxProvider
        reducers={{
          router: connectRouter(history) as Reducer
        }}
        middlewares={[routerMiddleware(history)]}
      >
        <ConnectedRouter history={history}>{props.children}</ConnectedRouter>
      </ReduxProvider>
    );
  };
}
