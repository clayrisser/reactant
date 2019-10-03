import React, { FC, ReactNode } from 'react';

export interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = props => <h1>{props.children}</h1>;

App.defaultProps = {
  children: 'Hello, reactant!'
};

export default App;
