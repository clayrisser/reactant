import React from 'react';
import ignoreWarnings from 'react-native-ignore-warnings';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import IosApp from '../../../ios/IosApp';
import createStore from '../createStore';
import { registerConfig } from '../config';
import { setLevel } from '../log';

export default function ios(initialProps = {}, config = {}) {
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
  registerConfig(config);
  const context = createStore({});
  context.persistor = persistStore(context.store);
  initialProps.context = context;
  AppRegistry.registerComponent(config.moduleName, () => {
    return () => <IosApp {...initialProps} />;
  });
  return { config, initialProps };
}
