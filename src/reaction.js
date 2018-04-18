import 'babel-polyfill';
import commander from 'commander';
import action from './action';
import error from './error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.command('build');
commander.option('-v --verbose', 'verbose logging');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
