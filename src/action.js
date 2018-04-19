import commander from 'commander';
import build from './build';
import clean from './clean';
import start from './start';
import validate from './validate';
import { setLevel } from './log';

export default async function action(cmd, options) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
  await validate(cmd, options);
  switch (cmd) {
    case 'build':
      return build(options);
    case 'clean':
      return clean(options);
    case 'start':
      return start(options);
    default:
      return commander.help();
  }
}
