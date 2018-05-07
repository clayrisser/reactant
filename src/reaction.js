import commander from 'commander';
import action from './action';
import error from './error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.command('build');
commander.command('clean');
commander.command('start');
commander.command('setup');
commander.option('-a --analyze', 'analyze bundle');
commander.option('-c --clean', 'clean');
commander.option('-d --debug', 'debug logging');
commander.option('-p --platform [name]', 'platform name');
commander.option('-v --verbose', 'verbose logging');
commander.option('--inspect', 'inspect');
commander.option('--inspect-brk', 'inpsect break');
commander.option('--offline', 'offline');
commander.option('--expo-platform [name]', 'expo platform name');
commander.option('--inotify', 'increase inotify');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
