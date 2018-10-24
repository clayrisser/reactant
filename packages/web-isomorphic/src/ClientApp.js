import _ from 'lodash';
import Promise from 'bluebird';
import React from 'react';
import autobind from 'autobind-decorator';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config, log } from '@reactant/core';
import { hydrate } from 'react-dom';
import Reactant from './Reactant';

@autobind
export default class ClientApp extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    const { container = document.getElementById('app') } = options;
    super(...arguments);
    this.Root = Root;
    this.container = container;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
  }

  async render() {
    await Promise.mapSeries(_.keys(this.plugins), async key => {
      const plugin = this.plugins[key];
      if (plugin.willRender) {
        await plugin.willRender(this);
      }
    });
    this.props.context = {
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss());
        return () => removeCss.forEach(f => f());
      }
    };
    this.Root = await this.getRoot({});
    const { Root } = this;
    hydrate(<Root {...this.props} />, document.getElementById('app'));
    await Promise.mapSeries(_.keys(this.plugins), async key => {
      const plugin = this.plugins[key];
      if (plugin.didRender) {
        await plugin.didRender(this);
      }
    });
  }

  async init() {
    await super.init();
    if (config.offline) require('offline-plugin/runtime').install();
    if (module.hot) {
      module.hot.accept('~/../web/ClientRoot', this.render);
    }
    await this.render().catch(log.error);
    return this;
  }
}
