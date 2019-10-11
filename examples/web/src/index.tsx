import React, { FC, ReactNode } from 'react';
import { Route, Switch, Router, Link } from '@reactant/router';

export interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = props => (
  <Router>
    <h1>{props.children}</h1>
    <Link to="/about">About</Link>
    <Link to="/users">Users</Link>
    <Link to="/">Home</Link>
    <Switch>
      <Route path="/about">
        <h2>About</h2>
      </Route>
      <Route path="/users">
        <h2>Users</h2>
      </Route>
      <Route path="/">
        <h2>Home</h2>
      </Route>
    </Switch>
  </Router>
);

App.defaultProps = {
  children: 'Hello, reactant!'
};

export default App;
