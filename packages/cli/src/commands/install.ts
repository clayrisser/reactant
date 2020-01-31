import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { install } from '@reactant/core';
import { getArgs } from '../util';

export default class Start extends Command {
  static description = 'install platform';

  static examples = ['$ reactant install ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: false }];

  async run() {
    const { args, flags } = this.parse(Start);
    const options: Options = {
      args: getArgs(this.argv, Start),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    return install(args.PLATFORM, options);
  }
}
