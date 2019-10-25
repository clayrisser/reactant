import { Command } from '@oclif/command';
import { Options } from '@reactant/context';
import { start } from '@reactant/core';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Start);
    // TODO
    await start(args.PLATFORM, (flags as unknown) as Options);
    return { args, flags };
  }
}
