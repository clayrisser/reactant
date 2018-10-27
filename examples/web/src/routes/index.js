import React, { Component } from 'react';
import { DynamicComponent } from '~/components';
import { Switch, Route } from 'react-router';

const Home = props => (
  <DynamicComponent load={() => import('./Home')}>
    {Component =>
      Component === null ? <h1>Loading</h1> : <Component {...props} />
    }
  </DynamicComponent>
);

const NotFound = props => (
  <DynamicComponent load={() => import('./NotFound')}>
    {Component =>
      Component === null ? <h1>Loading</h1> : <Component {...props} />
    }
  </DynamicComponent>
);

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
