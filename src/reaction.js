import 'babel-polyfill';
import commander from 'commander';
import action from '~/action';
import error from '~/error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.command('build');
commander.command('start');
commander.command('clean');
commander.option('-p --platform [name]', 'platform name');
commander.option('-v --verbose', 'verbose logging');
commander.option('-d --debug', 'debug logging');
commander.option('--inspect-brk', 'inpsect break');
commander.option('--inspect', 'inspect');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
