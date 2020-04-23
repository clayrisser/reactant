#!/bin/sh

sed -i "s/cache: Dict<NodeModule>;/cache: { [id: string]: NodeModule; };/g" node_modules/@types/node/globals.d.ts
