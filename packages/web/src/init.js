import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { hydrate } from 'react-dom';
import { config } from '@reactant/base';
import log, { setLevel } from '@reactant/base/log';

const { document } = window;

async function renderClient(initialProps) {
  // eslint-disable-next-line global-require
  const ClientApp = require('~/../web/ClientApp').default;
  hydrate(<ClientApp {...initialProps} />, document.getElementById('app'));
}

export default function client(initialProps = {}) {
  if (!config.options.debug) {
    ignoreWarnings(config.ignore.warnings || []);
    ignoreWarnings('error', config.ignore.errors || []);
  }
  if (
    config.options.verbose ||
    config.options.debug ||
    config.level === 'trace'
  ) {
    setLevel('trace');
  } else if (config.env === 'development') {
    setLevel('debug');
  } else {
    setLevel(config.level);
  }
  if (config !== 'production') window.reactant = { config };
  if (module.hot) {
    module.hot.accept(
      '~/../web/ClientApp',
      renderClient.bind(this, initialProps)
    );
  }
  renderClient(initialProps).catch(log.error);
  return { config, initialProps };
}
