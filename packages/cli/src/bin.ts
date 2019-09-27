import Ecosystem from '@ecosystem/core';
import { defaultConfig, getActions, Actions, Config } from '@reactant/core';
import { handle as handleError } from '@oclif/errors/lib/handle';
import Command from './command';

(async () => {
  try {
    const ecosystem = new Ecosystem<Config, Actions>(
      'reactant',
      defaultConfig,
      await getActions(),
      Command
    );
    await ecosystem.run();
  } catch (err) {
    handleError(err);
  }
})();
