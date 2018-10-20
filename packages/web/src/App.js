import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp } from '@reactant/core';
import { render } from 'react-dom';
import Reactant from './Reactant';

const { document } = window;

export default class App extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    super(...arguments);
    const { props = {}, container = document.getElementById('app') } = options;
    this.Root = Root;
    this.props = props;
    this.container = container;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
  }

  init() {
    super.init();
    const { Root } = this;
    render(<Root {...this.props} />, this.container);
  }
}
