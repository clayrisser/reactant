import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { start } from '@reactant/core';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static flags = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Start);
    const options: Options = {
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    return start(args.PLATFORM, options);
  }
}
