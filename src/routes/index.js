import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Home from './Home';
import NotFound from './NotFound';
import Splash from './Splash';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route path="/home" component={Home} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
