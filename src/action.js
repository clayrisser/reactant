import commander from 'commander';
import build from './build';
import validate from './validate';
import { setLevel } from './log';

export default async function action(cmd, options) {
  setLevel(options.verbose ? 'verbose' : 'info');
  await validate(cmd, options);
  switch (cmd) {
    case 'build':
      return build(options);
    default:
      return commander.help();
  }
}
