import React, { FC } from 'react';
import { PersistGate, PersistGateProps } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist';
import { Middleware, Store } from 'redux';
import {
  Provider as ReduxProvider,
  ProviderProps as ReduxProviderProps
} from 'react-redux';
import StoreCreator from './storeCreator';

export interface ProviderProps extends PersistGateProps, ReduxProviderProps {
  defaultState?: object;
  middleware?: Middleware[];
  options?: object;
  [key: string]: any;
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
      props.defaultState,
      props.middleware
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
