import { Command } from '@oclif/command';
import { Options } from '@reactant/types';
import { build } from '@reactant/core';

export default class Build extends Command {
  static description = 'build platform';

  static examples = ['$ reactant build ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args } = this.parse(Build);
    // TODO
    return build(args.PLATFORM, ({} as unknown) as Options);
  }
}
