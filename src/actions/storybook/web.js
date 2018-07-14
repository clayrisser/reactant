import easycp from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig from '../../createConfig';

export default async function storybookWeb(options, config) {
  if (!config) {
    config = await createConfig({ action: 'storybook', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const spinner = ora('starting web storybook\n').start();
  const storiesPath = fs.existsSync(
    path.resolve(config.paths.stories, '.storybook')
  )
    ? path.resolve(config.paths.stories, '.storybook')
    : path.resolve('node_modules/reaction-build/lib/storybook');
  spinner.stop();
  await easycp(
    `node node_modules/@storybook/react/bin -p ${
      config.ports.storybook
    } -c ${storiesPath}${options.debug ? ' -- --debug' : ''}${
      options.verbose ? ' -- --verbose' : ''
    }`
  );
}
