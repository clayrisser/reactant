import 'babel-polyfill';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import createStore from '../src/store/create';

const context = {};

context.store = createStore(context);
context.persistor = persistStore(context.store);
const initialProps = { context };

const AndroidApp = require('./AndroidApp').default;
AppRegistry.registerComponent('reaction', () => {
  return () => <AndroidApp {...initialProps} />;
});
