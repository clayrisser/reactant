import pkg from 'npm-pkg-json';
import { Command as EcosystemCommand } from '@ecosystem/core';
import { Config } from '@reactant/core';
import { flags } from '@oclif/command';

export default class Command extends EcosystemCommand {
  static description: string = pkg.description;

  static flags = {
    debug: flags.boolean({ char: 'd' })
  };

  async run() {
    const { flags } = this.parse(Command.EcosystemCommand);
    const config = await Command.EcosystemCommand.ecosystem.getConfig<Config>();
    return {
      runtimeConfig: {
        debug: flags.debug || config.debug
      }
    };
  }
}
