import { Command } from '@oclif/command';

export default class Clean extends Command {
  static description = 'clean platform';

  static examples = ['$ reactant clean ios'];

  static flags = {};

  static args = [{ name: 'PLATFORM', required: false }];

  async run() {
    const { args, flags } = this.parse(Clean);
    return { args, flags };
  }
}
