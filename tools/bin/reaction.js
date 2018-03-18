#!/usr/bin/env node

import 'babel-polyfill';
import commander from 'commander';
import action from '../lib/action';
import error from '../lib/error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.command('build');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
