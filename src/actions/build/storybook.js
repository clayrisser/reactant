import easycp from 'easycp';
import fs from 'fs-extra';
import path from 'path';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildStorybook(options, config) {
  if (!config) {
    config = createConfig({ options });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  const storiesPath = fs.existsSync(
    path.resolve(config.paths.stories, '.storybook')
  )
    ? path.resolve(config.paths.stories, '.storybook')
    : path.resolve('node_modules/reaction-build/lib/storybook');
  await easycp(
    `node node_modules/@storybook/react/bin/build -c ${storiesPath} -o ${
      config.paths.distStorybook
    }${options.debug ? ' -- --debug' : ''}${
      options.verbose ? ' -- --verbose' : ''
    }`
  );
}
