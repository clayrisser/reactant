import { createStore as reduxCreateStore, Store } from 'redux';

export default function createStore(): Store {
  return reduxCreateStore((f: any) => f, {});
}
