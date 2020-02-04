import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { storybook } from '@reactant/core';
import { getArgs } from '../util';
import { registerActions } from '../actions';

export default class Storybook extends Command {
  static description = 'storybook platform';

  static examples = ['$ reactant storybook ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Storybook);
    const options: Options = {
      args: getArgs(this.argv, Storybook),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    };
    const [pluginActions] = registerActions();
    return storybook(args.PLATFORM, options, pluginActions);
  }
}
