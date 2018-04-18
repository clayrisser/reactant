import commander from 'commander';
import build from './build';
import clean from './clean';
import validate from './validate';
import { setLevel } from './log';

export default async function action(cmd, options) {
  setLevel(options.verbose ? 'verbose' : 'info');
  await validate(cmd, options);
  switch (cmd) {
    case 'build':
      return build(options);
    case 'clean':
      return clean(options);
    default:
      return commander.help();
  }
}
