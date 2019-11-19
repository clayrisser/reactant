import React, { FC } from 'react';
import { Provider, storeContext } from '@reactant/redux/thunk';
import { withProvider } from '@reactant/router/redux';
import Routes from './routes';

export interface AppProps {}

const App: FC<AppProps> = (_props: AppProps) => <Routes />;

export default withProvider(Provider, storeContext)(App);
