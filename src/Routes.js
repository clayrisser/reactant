import NotFound from '~/routes/NotFound';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route component={NotFound} />
      </Switch>
    );
  }
}
