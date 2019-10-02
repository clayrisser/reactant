import pkg from 'npm-pkg-json';
import { Command as EcosystemCommand } from '@ecosystem/core';
import { Config, setLogger } from '@reactant/core';
import { flags } from '@oclif/command';

export default class Command extends EcosystemCommand {
  static description: string = pkg.description;

  static flags = {
    debug: flags.boolean({ char: 'd' }),
    platform: flags.string({ char: 'p', required: true })
  };

  async run() {
    setLogger(Command.EcosystemCommand.ecosystem.logger);
    const { flags } = this.parse(Command.EcosystemCommand);
    const config = await Command.EcosystemCommand.ecosystem.getConfig<Config>();
    return {
      runtimeConfig: {
        debug: flags.debug || config.debug,
        platformName: flags.platform,
        _state: { ready: true }
      }
    };
  }
}
