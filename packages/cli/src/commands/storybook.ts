import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { storybook } from '@reactant/core';

export default class Storybook extends Command {
  static description = 'storybook platform';

  static examples = ['$ reactant storybook ios'];

  static strict = false;

  static flags = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Storybook);
    const options: Options = {
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    return storybook(args.PLATFORM, options);
  }
}
