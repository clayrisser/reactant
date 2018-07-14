import React from 'react';
import ignoreWarnings from 'react-native-ignore-warnings';
import { AppRegistry } from 'react-native';
import { KeepAwake, registerRootComponent } from 'expo';
import { persistStore } from 'redux-persist';
import ExpoApp from '../../../expo/ExpoApp';
import createStore from '../createStore';
import { registerConfig } from '../config';
import { setLevel } from '../log';

export default function expo(componentName, initialProps = {}, config = {}) {
  ignoreWarnings(config.ignore.warnings || []);
  ignoreWarnings('error', config.ignore.errors || []);
  if (config.dev) KeepAwake.activate();
  if (config.options.verbose) {
    setLevel('verbose');
  } else if (config.options.debug || config.env === 'development') {
    setLevel('debug');
  }
  registerConfig(config);
  const context = {};
  context.store = createStore(context);
  context.persistor = persistStore(context.store);
  initialProps.context = context;
  registerRootComponent(() => <ExpoApp {...initialProps} />);
  return { config, initialProps };
}
