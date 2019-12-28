#!/bin/sh

DIRNAME=$(dirname "$0")

sed -i 's#interface NodeRequire#interface IgnoreNodeRequire#' $DIRNAME/node_modules/@types/node/globals.d.ts
sed -i 's#interface NodeModule#interface IgnoreNodeModule#' $DIRNAME/node_modules/@types/node/globals.d.ts
sed -i 's#cache: NodeRequireCache#cache: any#' $DIRNAME/node_modules/@types/node/globals.d.ts
sed -i 's/var require: NodeRequire/var require: NodeJS.Require/' $DIRNAME/node_modules/@types/webpack-env/index.d.ts
sed -i 's/var module: NodeModule/var module: NodeJS.Module/' $DIRNAME/node_modules/@types/webpack-env/index.d.ts
