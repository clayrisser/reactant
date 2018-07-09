import 'babel-polyfill';
import React from 'react';
import { KeepAwake, registerRootComponent } from 'expo';
import { persistStore } from 'redux-persist';
import createStore from '../src/store/create';

if (process.env.NODE_ENV === 'development') KeepAwake.activate();

const context = {};

context.store = createStore(context);
context.persistor = persistStore(context.store);
const initialProps = { context };

const ExpoApp = require('./ExpoApp').default;
registerRootComponent(() => <ExpoApp {...initialProps} />);
