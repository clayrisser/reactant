import React, { Component } from 'react';
import { Switch, Route } from 'react-router-defer';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={() => import('./Home')} />
        <Route component={() => import('./NotFound')} />
      </Switch>
    );
  }
}
