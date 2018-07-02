import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import NotFound from './NotFound';
import Splash from './Splash';
import TodoList from './TodoList';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Splash} />
        <Route path="/todo-list" component={TodoList} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
