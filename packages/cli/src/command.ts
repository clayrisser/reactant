import pkg from 'npm-pkg-json';
import { Command as EcosystemCommand } from '@ecosystem/core';
import { Config } from '@reactant/config';
import { flags } from '@oclif/command';

export default class Command extends EcosystemCommand {
  static description: string = pkg.description;

  static flags = {
    debug: flags.boolean({ char: 'd' }),
    platform: flags.string({ char: 'p', required: true })
  };

  async run() {
    const { flags } = this.parse(Command.EcosystemCommand);
    const config = await Command.EcosystemCommand.ecosystem.getConfig<Config>();
    return {
      runtimeConfig: {
        debug: flags.debug || config.debug,
        platform: flags.platform,
        _state: { ready: true }
      }
    };
  }
}
