import fs from 'fs-extra';
import { mapSeries } from 'bluebird';
import { Config } from './types';

export async function preAction(config: Config) {
  await mapSeries(Object.values(config.paths), async (path: string) => {
    await fs.mkdirs(path);
  });
}

export default async function postAction(_config: Config) {
  return _config;
}
