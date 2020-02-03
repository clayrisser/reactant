import React, { FC } from 'react';
import { Provider, storeContext } from '@reactant/redux/thunk';
import { withProvider } from '@reactant/router/redux';
import context from '@reactant/context';
import config from '@reactant/config';
import { getOptions as getPlatformOptions } from '@reactant/platform';
import { getOptions } from '@reactant/plugin';
import Routes from './routes';

console.log('context', context());
console.log('config', config());
console.log('platform', getPlatformOptions());
console.log('plugin', getOptions('redux'));

export interface AppProps {}

const App: FC<AppProps> = (_props: AppProps) => <Routes />;

export default withProvider(Provider, storeContext)(App);
