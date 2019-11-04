import React, { FC, ReactNode } from 'react';
import { Route, Switch, Router, Link } from '@reactant/router';

export interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (props: AppProps) => (
  <Router>
    <Link to="/about">About</Link>
    <Link to="/users">Users</Link>
    <Link to="/">Home</Link>
    {props.children}
    <Switch>
      <Route path="/about">
        About
      </Route>
      <Route path="/users">
        Users
      </Route>
      <Route path="/">
        Home
      </Route>
    </Switch>
  </Router>
);

App.defaultProps = {
  children: 'Hello, reactant!'
};

export default App;
