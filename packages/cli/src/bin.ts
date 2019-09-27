import Ecosystem from '@ecosystem/core';
import { handle as handleError } from '@oclif/errors/lib/handle';
import {
  Actions,
  Config,
  Paths,
  defaultConfig,
  getPlatformActions
} from '@reactant/core';
import Command from './command';

(async () => {
  try {
    const platformName = '';
    const config = { paths: {} as Paths };
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
