import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { MainContent } from '~/components';

@autobind
export default class Home extends Component {
  render() {
    return (
      <MainContent>
        <div>Hello, world</div>
      </MainContent>
    );
  }
}
