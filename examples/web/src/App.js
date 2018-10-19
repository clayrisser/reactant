import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { log } from '@reactant/core';
import { Button } from '~/components';

@autobind
export default class App extends Component {
  handleClick() {
    log.info('Hello, world!');
  }

  render() {
    return <Button onClick={this.handleClick}>Hello, world!</Button>;
  }
}
