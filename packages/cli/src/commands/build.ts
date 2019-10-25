import { Command } from '@oclif/command';
import { Options } from '@reactant/context';
import { build } from '@reactant/core';

export default class Build extends Command {
  static description = 'build platform';

  static examples = ['$ reactant build ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Build);
    // TODO
    await build(args.PLATFORM, (flags as unknown) as Options);
    return { args, flags };
  }
}
