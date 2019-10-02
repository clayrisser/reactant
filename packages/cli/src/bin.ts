import Ecosystem from '@ecosystem/core';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Config, Actions } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { createConfig, activate } from '@ecosystem/config';
import { handle as handleError } from '@oclif/errors/lib/handle';
import { parse, flags } from '@oclif/parser';
import {
  defaultConfig,
  postProcess,
  preProcess,
  getReactantPlatform
} from '@reactant/config';
import Command from './command';

async function resetConfig() {
  const rootPath = (await pkgDir(process.cwd())) || process.cwd();
  await fs.remove(
    path.resolve(
      rootPath,
      '.tmp/config',
      require(path.resolve(rootPath, 'package.json')).name || 'some-config'
    )
  );
}

(async () => {
  try {
    await resetConfig();
    activate(false);
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
      { platformName },
      preProcess,
      postProcess
    );
    const ecosystem = new Ecosystem<Config, Actions>(
      'reactant',
      defaultConfig,
      getReactantPlatform(platformName, config).actions,
      Command,
      false,
      preProcess,
      postProcess,
      undefined,
      [new PlatformApi()]
    );
    await ecosystem.run();
  } catch (err) {
    handleError(err);
  }
})();
