import React, { Component } from 'react';
import { Switch, Route } from 'react-router-defer';
import Home from './Home';
import NotFound from './NotFound';

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
