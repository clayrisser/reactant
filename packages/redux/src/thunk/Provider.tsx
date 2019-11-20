import PropTypes from 'prop-types';
import React, { Component, Context, ReactNode, createContext } from 'react';
import { Action, AnyAction, Middleware, Store } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist';
import { Provider as ReduxProvider, ReactReduxContextValue } from 'react-redux';
import StoreCreator from './storeCreator';
import { Reducers } from '../types';

export const storeContext = createContext<ReactReduxContextValue>(
  (null as unknown) as ReactReduxContextValue
);

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

class Provider extends Component<ProviderProps> {
  store: Store;

  persistor?: Persistor;

  // eslint-disable-next-line react/static-property-placement
  static childContextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props: ProviderProps) {
    super(props);
    if (props.store) {
      this.store = props.store;
      this.persistor = props.persistor;
    } else {
      const storeCreator = new StoreCreator(
        props.options,
        props.reducers,
        props.defaultState,
        props.middlewares
      );
      this.store = storeCreator.store;
      this.persistor = storeCreator.persistor;
    }
  }

  getChildContext() {
    return {
      store: this.store
    };
  }

  render() {
    if (this.persistor) {
      return (
        <ReduxProvider store={this.store} context={storeContext}>
          <PersistGate
            loading={this.props.loading}
            persistor={this.persistor}
            onBeforeLift={this.props.onBeforeLift}
          >
            {this.props.children}
          </PersistGate>
        </ReduxProvider>
      );
    }
    return (
      <ReduxProvider store={this.store} context={storeContext}>
        {this.props.children}
      </ReduxProvider>
    );
  }
}

export default Provider;
