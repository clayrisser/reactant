import React from 'react';
import ignoreWarnings from 'react-native-ignore-warnings';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import AndroidApp from '../../../android/AndroidApp';
import createStore from '../createStore';
import { registerConfig } from '../config';
import { setLevel } from '../log';

export default function android(initialProps = {}, config = {}) {
  ignoreWarnings(config.ignore.warnings || []);
  ignoreWarnings('error', config.ignore.errors || []);
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
  if (config !== 'production') window.reaction = { config };
  registerConfig(config);
  const context = {};
  context.store = createStore(context);
  context.persistor = persistStore(context.store);
  initialProps.context = context;
  AppRegistry.registerComponent(config.moduleName, () => {
    return () => <AndroidApp {...initialProps} />;
  });
  return { config, initialProps };
}
