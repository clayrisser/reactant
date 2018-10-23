import Cookies from 'cookies-js';
import React from 'react';
import autobind from 'autobind-decorator';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config, log } from '@reactant/core';
import { hydrate } from 'react-dom';
import Reactant from './Reactant';

@autobind
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
    hydrate(<Root {...this.props} />, document.getElementById('app'));
  }

  init() {
    super.init();
    return new Promise(async resolve => {
      if (config.offline) require('offline-plugin/runtime').install();
      if (module.hot) {
        module.hot.accept('~/../web/ClientRoot', this.render);
      }
      await this.render().catch(log.error);
      return resolve(this);
    });
  }
}
