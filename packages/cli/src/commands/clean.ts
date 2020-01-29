import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { clean } from '@reactant/core';
import { getArgs } from '../util';

export default class Clean extends Command {
  static description = 'clean platform';

  static examples = ['$ reactant clean ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: false }];

  async run() {
    const { args, flags } = this.parse(Clean);
    const options: Options = {
      args: getArgs(this.argv, Clean),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    return clean(args.PLATFORM, options);
  }
}
