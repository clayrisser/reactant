import { Command } from '@oclif/command';

export default class Build extends Command {
  static description = 'build platform';

  static examples = ['$ reactant build ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: true }];

  async run() {
    const { args, flags } = this.parse(Build);
    return { args, flags };
  }
}
