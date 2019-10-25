import { Command } from '@oclif/command';

export default class Start extends Command {
  static description = 'start platform';

  static examples = ['$ reactant start ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Start);
    return { args, flags };
  }
}
