import commander from 'commander';
import build from './build';
import validate from './validate';

export default async function action(cmd, options) {
  await validate(cmd, options);
  switch (cmd) {
    case 'build':
      return build();
    default:
      return commander.help();
  }
}
