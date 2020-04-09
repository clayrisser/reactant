import { FC } from 'react';
import config from '@reactant/config';
import context from '@reactant/context';

console.log('context', context());
console.log('config', config());

export interface AppProps {}

const App: FC<AppProps> = (_props: AppProps) => 'Hello, world';

export default App;
