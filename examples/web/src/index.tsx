import React, { FC } from 'react';
import config from '@reactant/config';
import context from '@reactant/context';
import { Provider, storeContext } from '@reactant/redux/thunk';
import { withProvider } from 'react-router-shim/redux';
import Routes from './routes';

console.log('context', context());
console.log('config', config());

export interface AppProps {}

const App: FC<AppProps> = (_props: AppProps) => <Routes />;

export default withProvider(Provider, storeContext)(App);
