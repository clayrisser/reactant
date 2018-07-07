import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import createStore from '../src/store/create';

const context = {};

const renderApp = async () => {
  context.store = await createStore(context);
  context.persistor = persistStore(context.store);
  const initialProps = {
    context
  };
  const IosApp = require('./IosApp').default;
  AppRegistry.registerComponent('reaction', () => {
    return () => <IosApp {...initialProps} />;
  });
};

renderApp();
