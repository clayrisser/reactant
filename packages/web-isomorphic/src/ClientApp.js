import Cookies from 'cookies-js';
import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config, log } from '@reactant/core';
import { hydrate } from 'react-dom';
import { persistStore } from 'redux-persist';
import { render } from 'react-dom';
import Reactant from './Reactant';

const { document } = window;

export default class ClientApp extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    const { props = {}, container = document.getElementById('app') } = options;
    super(...arguments);
    this.Root = Root;
    this.props = props;
    this.container = container;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
  }

  async render() {
    const { Root } = this;
    this.props.context = {
      cookieJar: Cookies,
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss());
        return () => removeCss.forEach(f => f());
      }
    };
    hydrate(<ClientApp {...initialProps} />, document.getElementById('app'));
  }

  init() {
    super.init();
    if (config.offline) require('offline-plugin/runtime').install();
    if (module.hot) {
      module.hot.accept(
        '~/../web/ClientRoot',
        renderClient.bind(this, initialProps)
      );
    }
    this.render().catch(log.error);
  }
}
