import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { config } from '@reactant/core';
import { render } from 'react-dom';
import { setLevel } from '@reactant/core/log';
import ClientApp from '~/../web/ClientApp';

const { document } = window;

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
  render(<ClientApp {...initialProps} />, document.getElementById('app'));
  return { config, initialProps };
}
