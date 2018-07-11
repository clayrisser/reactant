import 'babel-polyfill';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import createStore from 'reaction-base/lib/createStore';
import { persistStore } from 'redux-persist';

const context = {};

context.store = createStore(context);
context.persistor = persistStore(context.store);
const initialProps = { context };

const IosApp = require('./IosApp').default;
AppRegistry.registerComponent('reaction', () => {
  return () => <IosApp {...initialProps} />;
});
