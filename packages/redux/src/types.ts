import { Context, FC, ReactNode } from 'react';
import { Action, AnyAction, Middleware, Reducer, Store } from 'redux';
import { Persistor } from 'redux-persist';
import { ReactReduxContextValue } from 'react-redux';

export interface Reducers {
  [key: string]: Reducer;
}

export interface ProviderProps<A extends Action = AnyAction> {
  children?: ReactNode | ((bootstrapped: boolean) => ReactNode);
  context?: Context<ReactReduxContextValue>;
  defaultState?: object;
  loading?: ReactNode;
  middlewares?: Middleware[];
  onBeforeLift?(): void | Promise<void>;
  options?: object;
  persistor?: Persistor;
  reducers?: Reducers;
  store?: Store<any, A>;
}
export type Provider = FC<ProviderProps>;
