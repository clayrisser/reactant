#!/bin/sh

DIRNAME=$(dirname "$0")
sed -i "s#  import { ReactReduxContextValue } from 'react-redux';#  // @ts-ignore\n  import { ReactReduxContextValue } from 'react-redux';#" $DIRNAME/node_modules/connected-react-router/index.d.ts
