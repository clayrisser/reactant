import _ from 'lodash';
import easycp, { silentcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { loadConfig } from '../config';

const { env } = process;
let didClean = false;

export default async function clean(options) {
  if (didClean) return false;
  const spinner = ora('cleaning').start();
  didClean = true;
  const config = loadConfig({ action: 'clean', options });
  const { paths } = config;
  fs.removeSync(path.resolve(env.TMPDIR || '/tmp', 'haste-map-*'));
  fs.removeSync(path.resolve(env.TMPDIR || '/tmp', 'metro-*'));
  fs.removeSync(path.resolve(env.TMPDIR || '/tmp', 'react-*'));
  fs.removeSync(path.resolve(paths.android, 'app/build'));
  fs.removeSync(path.resolve(paths.android, 'build'));
  fs.removeSync(path.resolve(paths.android, 'config.json'));
  if (options.debug) {
    await easycp('watchman watch-del-all');
  } else {
    await silentcp('watchman watch-del-all');
  }
  if (options.platform) {
    fs.removeSync(paths[`dist${_.startCase(options.platform)}`]);
    fs.removeSync(path.resolve(paths.debug, _.startCase(options.platform)));
    if (options.platform !== 'web') {
      fs.removeSync(path.resolve(paths[options.platform], 'config.json'));
    }
    if (options.storybook) {
      fs.removeSync(
        path.resolve(paths.root, 'node_modules/.cache/react-storybook')
      );
      if (options.platform === 'web') {
        fs.removeSync(paths.distStorybook);
      }
    }
  } else {
    fs.removeSync(path.resolve(paths.android, 'config.json'));
    fs.removeSync(path.resolve(paths.expo, 'config.json'));
    fs.removeSync(path.resolve(paths.ios, 'config.json'));
    fs.removeSync(path.resolve(paths.root, 'node_modules/.cache'));
    fs.removeSync(paths.dist);
    fs.removeSync(paths.reactant);
  }
  fs.removeSync(path.resolve('.expo'));
  spinner.succeed('cleaned');
  return true;
}
