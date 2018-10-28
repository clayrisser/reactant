import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Loadable from 'react-loadable';

const Home = Load(() => import('./Home'));
const NotFound = Load(() => import('./NotFound'));

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

function Load(loader) {
  return Loadable({ loader, loading: () => 'loading' });
}
