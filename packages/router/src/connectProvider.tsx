import React, { FC } from 'react';
import { Provider, Reducer } from '@reactant/redux';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import history from './history';

export interface ProviderProps {}

export default function connectProvider(
  ReduxProvider: Provider
): (App: React.FC<{}>) => (props: ProviderProps) => JSX.Element {
  return (App: FC) => {
    return (props: ProviderProps) => {
      return (
        <ReduxProvider
          reducers={{
            router: connectRouter(history) as Reducer
          }}
          middlewares={[routerMiddleware(history)]}
        >
          <ConnectedRouter history={history}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <App {...props} />
          </ConnectedRouter>
        </ReduxProvider>
      );
    };
  };
}
