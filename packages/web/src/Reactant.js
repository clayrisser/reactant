import React, { Component } from 'react';
import App from '~/App';

export default class Reactant extends Component {
  render() {
    return <App {...this.props} />;
  }
}
