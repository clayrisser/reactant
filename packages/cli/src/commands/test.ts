import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { test } from '@reactant/core';
import { getArgs } from '../util';
import { registerActions } from '../actions';

export default class Test extends Command {
  static description = 'test platform';

  static examples = ['$ reactant test ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false }),
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Test);
    const options: Options = {
      args: getArgs(this.argv, Test),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug,
    };
    const [pluginActions] = registerActions();
    return test(args.PLATFORM, options, pluginActions);
  }
}
