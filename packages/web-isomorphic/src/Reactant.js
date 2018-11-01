import App from '~/App';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class Reactant extends Component {
  render() {
    return <App {...this.props} />;
  }
}

export default hot(module)(Reactant);
