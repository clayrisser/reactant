import { Command } from '@oclif/command';
import { Options } from '@reactant/context';
import { clean } from '@reactant/core';

export default class Clean extends Command {
  static description = 'clean platform';

  static examples = ['$ reactant clean ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: false }];

  async run() {
    const { args, flags } = this.parse(Clean);
    // TODO
    await clean(args.PLATFORM, (flags as unknown) as Options);
    return { args, flags };
  }
}
