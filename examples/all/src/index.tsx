import React, { FC, ReactNode } from 'react';
import { Provider } from '@reactant/redux/thunk';
import { Route, Switch, Router, Link } from '@reactant/router';
import Text from './components/Text';
import View from './components/View';

export interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (props: AppProps) => (
  <Provider>
    <Router>
      <View style={{ marginTop: 80 }}>
        <Link to="/about">
          <Text>About</Text>
        </Link>
        <Link to="/users">
          <Text>Users</Text>
        </Link>
        <Link to="/">
          <Text>Home</Text>
        </Link>
        <Text>{props.children}</Text>
        <Switch>
          <Route path="/about">
            <Text>About</Text>
          </Route>
          <Route path="/users">
            <Text>Users</Text>
          </Route>
          <Route path="/">
            <Text>Home</Text>
          </Route>
        </Switch>
      </View>
    </Router>
  </Provider>
);

App.defaultProps = {
  children: 'Hello, reactant!'
};

export default App;
