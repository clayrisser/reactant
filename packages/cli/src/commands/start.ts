import { Command } from '@oclif/command';
import { Options } from '@reactant/types';
import { start } from '@reactant/core';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args } = this.parse(Start);
    // TODO
    return start(args.PLATFORM, ({} as unknown) as Options);
  }
}
