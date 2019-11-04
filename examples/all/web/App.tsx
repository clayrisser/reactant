import React from 'react';
import { Reactant } from '@reactant/web';

export interface AppProps {}

const App: React.FC<AppProps> = props => <Reactant {...props} />;

export default App;
