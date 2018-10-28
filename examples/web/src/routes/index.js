import React, { Component } from 'react';
import { Switch, Route } from 'react-router-defer';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" componentDefer={() => import('./Home')} />
        <Route componentDefer={() => import('./NotFound')} />
      </Switch>
    );
  }
}
