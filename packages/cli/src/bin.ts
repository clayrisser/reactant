import Ecosystem from '@ecosystem/core';
import Err from 'err';
import { createConfig } from '@ecosystem/config';
import { handle as handleError } from '@oclif/errors/lib/handle';
import { parse, flags } from '@oclif/parser';
import {
  Actions,
  Config,
  defaultConfig,
  getPlatformActions,
  postProcess,
  preProcess
} from '@reactant/core';
import Command from './command';

(async () => {
  try {
    const output = parse(process.argv, {
      strict: false,
      flags: {
        platform: flags.string({ char: 'p' })
      }
    });
    const platformName = output.flags.platform;
    if (!platformName) throw new Err('platform name requried');
    const config = await createConfig<Config>(
      'reactant',
      defaultConfig,
      {},
      preProcess,
      postProcess
    );
    console.log(await getPlatformActions(platformName, config));
    process.exit();
    const ecosystem = new Ecosystem<Config, Actions>(
      'reactant',
      defaultConfig,
      await getPlatformActions(platformName, config),
      Command
    );
    await ecosystem.run();
  } catch (err) {
    handleError(err);
  }
})();
