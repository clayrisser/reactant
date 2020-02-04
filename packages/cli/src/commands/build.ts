import { Command, flags } from '@oclif/command';
import { Options } from '@reactant/types';
import { build } from '@reactant/core';
import { getArgs } from '../util';
import { registerActions } from '../actions';

export default class Build extends Command {
  static description = 'build platform';

  static examples = ['$ reactant build ios'];

  static strict = false;

  static flags: flags.Input<any> = {
    analyze: flags.boolean({ char: 'a', required: false }),
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false }),
    docker: flags.boolean({ required: false })
  };

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Build);
    const options: Options = {
      analyze: !!flags.analyze,
      args: getArgs(this.argv, Build),
      config: JSON.parse(flags.config || '{}'),
      debug: !!flags.debug,
      docker: !!flags.docker
    };
    const [pluginActions] = registerActions();
    return build(args.PLATFORM, options, pluginActions);
  }
}
