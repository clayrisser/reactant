import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Splash from './Splash';
import NotFound from './NotFound';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
