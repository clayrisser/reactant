#!/bin/sh

DIRNAME=$(dirname "$0")

sed -i 's/var require: NodeRequire/var require: NodeJS.Require/' $DIRNAME/node_modules/@types/react-native/index.d.ts
