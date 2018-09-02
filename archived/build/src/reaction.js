import commander from 'commander';
import action from './action';
import error from './error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.command('build');
commander.command('bundle');
commander.command('clean');
commander.command('configure');
commander.command('setup');
commander.command('start');
commander.option('--action [action]', 'override default action');
commander.option('--clean', 'clean');
commander.option('--device [device]', 'run on device');
commander.option('--expo-platform [name]', 'expo platform name');
commander.option('--inotify', 'increase inotify');
commander.option('--inspect', 'inspect');
commander.option('--inspect-brk', 'inpsect break');
commander.option('--offline', 'offline');
commander.option('--simulator [simulator]', 'run on simulator');
commander.option('-a --analyze', 'analyze bundle');
commander.option('-c --config [config]', 'config');
commander.option('-d --debug', 'debug logging');
commander.option('-p --platform [name]', 'platform name');
commander.option('-s --storybook', 'storybook');
commander.option('-v --verbose', 'verbose logging');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
