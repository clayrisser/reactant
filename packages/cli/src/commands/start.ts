import { Command } from '@oclif/command';
import { start } from '@reactant/core';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Start);
    await start();
    return { args, flags };
  }
}
