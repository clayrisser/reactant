import pkg from 'npm-pkg-json';
import { Command as EcosystemCommand } from '@ecosystem/core';
// import { flags } from '@oclif/command';

export default class Command extends EcosystemCommand {
  static description: string = pkg.description;

  static flags = {};

  async run() {
    // const { flags } = this.parse(Command.EcosystemCommand);
    // const config = await Command.EcosystemCommand.ecosystem.getConfig<Config>();
    return {
      runtimeConfig: {}
    };
  }
}
