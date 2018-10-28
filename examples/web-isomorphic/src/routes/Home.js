import Link from '@reactant/react-router/Link';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button } from '~/components';
import { log } from '@reactant/core';

@autobind
export default class Home extends Component {
  handleClick() {
    log.info('Hello, world!');
  }

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.handleClick}>Hello, world!</Button>
        </div>
        <div>
          <Link to="/not-found">Not Found</Link>
        </div>
      </div>
    );
  }
}
