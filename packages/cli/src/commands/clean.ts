import { Command } from '@oclif/command';
import { Options } from '@reactant/types';
import { clean } from '@reactant/core';

export default class Clean extends Command {
  static description = 'clean platform';

  static examples = ['$ reactant clean ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: false }];

  async run() {
    const { args } = this.parse(Clean);
    // TODO
    return clean(args.PLATFORM, ({} as unknown) as Options);
  }
}
