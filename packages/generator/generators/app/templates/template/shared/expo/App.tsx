import React from 'react';
import { Reactant } from '@reactant/expo';

export interface AppProps {}

const App: React.FC<AppProps> = (props: AppProps) => <Reactant {...props} />;

export default App;
