import Ecosystem from '@ecosystem/core';
import { createConfig } from '@ecosystem/config';
import { handle as handleError } from '@oclif/errors/lib/handle';
import { parse, flags } from '@oclif/parser';
import {
  Actions,
  Config,
  defaultConfig,
  getReactantPlatform,
  postProcess,
  preProcess
} from '@reactant/core';
import Command from './command';

(async () => {
  try {
    const output = parse(process.argv, {
      strict: false,
      flags: {
        platform: flags.string({ char: 'p', required: true })
      }
    });
    const platformName = output.flags.platform;
    const config = await createConfig<Config>(
      'reactant',
      defaultConfig,
      {},
      preProcess,
      postProcess
    );
    const ecosystem = new Ecosystem<Config, Actions>(
      'reactant',
      defaultConfig,
      (await getReactantPlatform(platformName, config)).actions,
      Command
    );
    await ecosystem.run();
  } catch (err) {
    handleError(err);
  }
})();
