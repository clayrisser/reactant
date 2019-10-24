import path from 'path';
import { asyncToSync } from '@reactant/platform';

export function createWebpack() {
  const result = asyncToSync(
    path.resolve(__dirname, './createWebpack'),
    path.resolve(__dirname, './_createWebpack.interface.json')
  );
  return result;
}

module.exports = createWebpack();
