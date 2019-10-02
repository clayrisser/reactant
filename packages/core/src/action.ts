import fs from 'fs-extra';
import util from 'util';
import { mapSeries } from 'bluebird';
import { Config } from './types';
import { getLogger } from './logger';

export async function preAction(config: Config) {
  const logger = getLogger();
  if (config.debug) {
    logger.spinner.stop();
    logger.debug(
      '\n\n======== BEGIN CONFIG ========\n',
      util.inspect(config, {
        colors: true,
        showHidden: true,
        depth: null
      }),
      '\n========= END CONFIG =========\n\n'
    );
    logger.spinner.start();
  }
  await mapSeries(Object.values(config.paths), async (path: string) => {
    await fs.mkdirs(path);
  });
}

export default async function postAction(_config: Config) {
  return _config;
}
