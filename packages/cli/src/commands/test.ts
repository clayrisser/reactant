import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { test } from '@reactant/core';

export default class Test extends Command {
  static description = 'test platform';

  static examples = ['$ reactant test ios'];

  static strict = false;

  static flags = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Test);
    const options: Options = {
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    return test(args.PLATFORM, options);
  }
}
