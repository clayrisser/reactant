import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { start } from '@reactant/core';
import { getArgs } from '../util';
import { registerActions } from '../actions';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false }),
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Start);
    const options: Options = {
      args: getArgs(this.argv, Start),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug,
    };
    const [pluginActions] = registerActions();
    return start(args.PLATFORM, options, pluginActions);
  }
}
