import React, { Context, FC, ReactNode } from 'react';
import { Action, AnyAction, Middleware, Store } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist';
import { Provider as ReduxProvider, ReactReduxContextValue } from 'react-redux';
import StoreCreator from './storeCreator';
import { Reducers } from '../types';

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

const Provider: FC<ProviderProps> = (props: ProviderProps) => {
  let store: Store;
  let persistor: Persistor | undefined;
  if (props.store) {
    store = props.store;
    persistor = props.persistor;
  } else {
    const storeCreator = new StoreCreator(
      props.options,
      props.reducers,
      props.defaultState,
      props.middlewares
    );
    store = storeCreator.store;
    persistor = storeCreator.persistor;
  }
  if (persistor) {
    return (
      <ReduxProvider store={store} context={props.context}>
        <PersistGate
          loading={props.loading}
          persistor={persistor}
          onBeforeLift={props.onBeforeLift}
        >
          {props.children}
        </PersistGate>
      </ReduxProvider>
    );
  }
  return (
    <ReduxProvider store={store} context={props.context}>
      {props.children}
    </ReduxProvider>
  );
};

export default Provider;
